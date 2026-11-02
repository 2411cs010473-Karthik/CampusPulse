import json, os
import numpy as np
from preprocessing import clean_text, MAX_LEN
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "saved_model")

class Predictor:
    """Uses the trained LSTM if present. Otherwise a clearly-labelled DEMO FALLBACK
    (TF-IDF + logistic regression, NOT deep learning) so the UI still runs."""
    def __init__(self):
        self.kind = None; self.error = None
        try:
            from tensorflow.keras.models import load_model
            from tensorflow.keras.preprocessing.text import tokenizer_from_json
            self.model = load_model(os.path.join(D, "lstm_model.keras"))
            self.tok = tokenizer_from_json(open(os.path.join(D, "tokenizer.json")).read())
            self.classes = json.load(open(os.path.join(D, "labels.json")))["classes"]
            self.kind = "LSTM"
        except Exception as e:
            self.error = f"LSTM not available ({type(e).__name__}: {e}). Run train_model.py."
            self._fallback()

    def _fallback(self):
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.linear_model import LogisticRegression
        from synthetic import make_samples
        rows = make_samples(900, seed=1)
        self.vec = TfidfVectorizer(ngram_range=(1, 2)); X = self.vec.fit_transform([clean_text(r["feedback"]) for r in rows])
        self.clf = LogisticRegression(max_iter=500).fit(X, [r["label"] for r in rows])
        self.classes = list(self.clf.classes_); self.kind = "DEMO_FALLBACK"

    @property
    def is_trained_lstm(self):
        return self.kind == "LSTM"

    def predict(self, texts):
        cleaned = [clean_text(t) for t in texts]
        if self.kind == "LSTM":
            from tensorflow.keras.preprocessing.sequence import pad_sequences
            P = self.model.predict(pad_sequences(self.tok.texts_to_sequences(cleaned), maxlen=MAX_LEN, padding="post"), verbose=0)
        else:
            P = self.clf.predict_proba(self.vec.transform(cleaned))
        return [(str(self.classes[int(np.argmax(p))]), float(np.max(p))) for p in P]

_p = None
def get_predictor():
    global _p
    if _p is None: _p = Predictor()
    return _p
