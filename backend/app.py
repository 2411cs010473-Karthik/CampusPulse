import io, os, json, secrets, random
from collections import Counter
from datetime import datetime, timedelta
import pandas as pd
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import func
from database import db, User, Feedback, Category, TrainingRun
from predict import get_predictor
from preprocessing import keywords
from synthetic import CATEGORIES, DEPARTMENTS

BASE = os.path.dirname(os.path.abspath(__file__))
SAMPLE = os.path.join(BASE, "..", "sample_data", "university_feedback.csv")
METRICS = os.path.join(BASE, "saved_model", "metrics.json")
SENTS = ["Positive", "Negative", "Neutral"]
TOKENS = {}
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(BASE, "unipulse.db")
CORS(app); db.init_app(app)

def err(msg, code=400): return jsonify({"error": msg}), code

def auth(fn):
    def w(*a, **k):
        if request.headers.get("Authorization", "").replace("Bearer ", "") not in TOKENS: return err("Unauthorized", 401)
        return fn(*a, **k)
    w.__name__ = fn.__name__; return w

def satisfaction(p, n, total): return round((p + 0.5 * n) / total * 100, 1) if total else 0

def save_rows(rows, source, dates=None):
    preds = get_predictor().predict([r["text"] for r in rows]); kind = get_predictor().kind
    for i, (r, (s, c)) in enumerate(zip(rows, preds)):
        db.session.add(Feedback(text=r["text"], category=r["category"], department=r["department"], sentiment=s, confidence=c,
                                model_type=kind, source=source, created_at=dates[i] if dates else datetime.utcnow()))
    db.session.commit(); return len(rows)

def seed():
    if User.query.first() is None:
        db.session.add(User(email="admin@campuspulse.edu", password_hash=generate_password_hash("Admin@123"), name="Dr. Admin"))
        db.session.add_all([Category(name=n, kind="category") for n in CATEGORIES] + [Category(name=n, kind="department") for n in DEPARTMENTS])
        db.session.commit()
    if Feedback.query.count() == 0 and os.path.exists(SAMPLE):
        df = pd.read_csv(SAMPLE); rnd = random.Random(3); now = datetime.utcnow()
        rows = [{"text": r.feedback, "category": r.category, "department": r.department} for r in df.itertuples()]
        save_rows(rows, "demo", [now - timedelta(days=rnd.randint(0, 89), hours=rnd.randint(0, 23)) for _ in rows])
    if os.path.exists(METRICS) and TrainingRun.query.count() == 0:
        m = json.load(open(METRICS))
        db.session.add(TrainingRun(dataset_size=m["dataset_size"], epochs=m["epochs_run"], train_accuracy=m["train_accuracy"], val_accuracy=m["val_accuracy"]))
        db.session.commit()

@app.get("/api/health")
def health():
    p = get_predictor()
    return jsonify({"status": "ok", "model_type": p.kind, "lstm_trained": p.is_trained_lstm, "database": "connected", "warning": p.error})

@app.post("/api/login")
def login():
    d = request.get_json(silent=True) or {}
    u = User.query.filter_by(email=str(d.get("email", "")).strip().lower()).first()
    if not u or not check_password_hash(u.password_hash, d.get("password", "")): return err("Invalid email or password", 401)
    t = secrets.token_hex(16); TOKENS[t] = u.id
    return jsonify({"token": t, "user": {"name": u.name, "email": u.email}})

@app.get("/api/meta")
@auth
def meta(): return jsonify({"categories": CATEGORIES, "departments": DEPARTMENTS})

def group_stats(col):
    out = {}
    for k, s, c in db.session.query(col, Feedback.sentiment, func.count()).group_by(col, Feedback.sentiment):
        out.setdefault(k, {"Positive": 0, "Negative": 0, "Neutral": 0})[s] = c
    res = []
    for k, v in out.items():
        t = sum(v.values()); res.append({"name": k, **v, "total": t, "satisfaction": satisfaction(v["Positive"], v["Neutral"], t)})
    return sorted(res, key=lambda x: -x["satisfaction"])

def top_terms(sentiment, n=10):
    c = Counter()
    for (t,) in db.session.query(Feedback.text).filter_by(sentiment=sentiment): c.update(set(keywords(t)))
    return [{"term": k, "count": v} for k, v in c.most_common(n)]

@app.get("/api/dashboard")
@auth
def dashboard():
    total = Feedback.query.count()
    cnt = {s: Feedback.query.filter_by(sentiment=s).count() for s in SENTS}
    now = datetime.utcnow(); month = Feedback.query.filter(Feedback.created_at >= now.replace(day=1, hour=0, minute=0, second=0)).count()
    trend = {}
    for f in Feedback.query.filter(Feedback.created_at >= now - timedelta(days=30)):
        d = trend.setdefault(f.created_at.strftime("%m-%d"), {"date": f.created_at.strftime("%m-%d"), "Positive": 0, "Negative": 0, "Neutral": 0}); d[f.sentiment] += 1
    cats, depts = group_stats(Feedback.category), group_stats(Feedback.department)
    pct = lambda s: round(cnt[s] / total * 100, 1) if total else 0
    return jsonify({"total": total, "positive_pct": pct("Positive"), "negative_pct": pct("Negative"), "neutral_pct": pct("Neutral"),
        "satisfaction": satisfaction(cnt["Positive"], cnt["Neutral"], total), "this_month": month,
        "distribution": [{"name": s, "value": cnt[s]} for s in SENTS], "trend": sorted(trend.values(), key=lambda x: x["date"]),
        "categories": cats, "departments": depts, "recent": [f.to_dict() for f in Feedback.query.order_by(Feedback.created_at.desc()).limit(8)],
        "concerns": top_terms("Negative", 8), "top_areas": cats[:3], "attention": sorted(cats, key=lambda x: x["satisfaction"])[:3],
        "model_type": get_predictor().kind})

@app.post("/api/analyze")
@auth
def analyze():
    d = request.get_json(silent=True) or {}
    text, cat, dep = str(d.get("feedback", "")).strip(), d.get("category"), d.get("department")
    if len(text) < 5: return err("Feedback must be at least 5 characters")
    if cat not in CATEGORIES or dep not in DEPARTMENTS: return err("Invalid category or department")
    save_rows([{"text": text, "category": cat, "department": dep}], "manual")
    f = Feedback.query.order_by(Feedback.id.desc()).first()
    return jsonify({**f.to_dict(), "model_type": f.model_type})

@app.post("/api/upload")
@auth
def upload():
    f = request.files.get("file")
    if not f or not f.filename.lower().endswith(".csv"): return err("Please upload a .csv file")
    try: df = pd.read_csv(io.BytesIO(f.read()))
    except Exception as e: return err(f"Could not read CSV: {e}")
    df.columns = [c.strip().lower() for c in df.columns]
    missing = {"feedback", "category", "department"} - set(df.columns)
    if missing: return err("Missing columns: " + ", ".join(sorted(missing)))
    rows, errors = [], []
    for i, r in df.iterrows():
        t, c, d = str(r["feedback"]).strip(), str(r["category"]).strip(), str(r["department"]).strip()
        if len(t) < 5 or t == "nan": errors.append(f"Row {i+2}: empty/short feedback")
        elif c not in CATEGORIES: errors.append(f"Row {i+2}: unknown category '{c}'")
        elif d not in DEPARTMENTS: errors.append(f"Row {i+2}: unknown department '{d}'")
        else: rows.append({"text": t, "category": c, "department": d})
    saved = save_rows(rows, "upload") if rows else 0
    return jsonify({"saved": saved, "rejected": len(errors), "errors": errors[:20], "model_type": get_predictor().kind})

@app.get("/api/feedback")
@auth
def feedback():
    q = Feedback.query
    for k, col in (("sentiment", Feedback.sentiment), ("category", Feedback.category), ("department", Feedback.department)):
        if request.args.get(k): q = q.filter(col == request.args[k])
    if request.args.get("q"): q = q.filter(Feedback.text.ilike(f"%{request.args['q']}%"))
    rows = q.order_by(Feedback.created_at.desc()).all()
    if request.args.get("format") == "csv":
        df = pd.DataFrame([r.to_dict() for r in rows])
        return Response(df.to_csv(index=False), mimetype="text/csv", headers={"Content-Disposition": "attachment; filename=feedback_report.csv"})
    return jsonify({"total": len(rows), "items": [r.to_dict() for r in rows[:500]]})

@app.get("/api/insights")
@auth
def insights():
    cats, depts = group_stats(Feedback.category), group_stats(Feedback.department)
    return jsonify({"note": "Term frequencies are simple keyword counts over the text. Sentiment labels come from the model (" + get_predictor().kind + ").",
        "complaints": top_terms("Negative", 12), "praise": top_terms("Positive", 12),
        "best_departments": depts[:3], "worst_departments": depts[::-1][:3], "improve_categories": sorted(cats, key=lambda x: x["satisfaction"])[:3]})

@app.get("/api/model-performance")
@auth
def perf():
    p = get_predictor()
    if not os.path.exists(METRICS):
        return jsonify({"status": "Not Trained", "model_type": p.kind, "warning": p.error or "Run train_model.py", "classes": 3})
    m = json.load(open(METRICS)); return jsonify({**m, "status": "Trained" if p.is_trained_lstm else "Not Loaded", "warning": p.error})

with app.app_context():
    db.create_all(); seed()

if __name__ == "__main__":
    app.run(port=5000, debug=False)
