from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(80), default="Administrator")

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    kind = db.Column(db.String(20))  # category | department

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(80), index=True)
    department = db.Column(db.String(80), index=True)
    sentiment = db.Column(db.String(20), index=True)
    confidence = db.Column(db.Float)
    model_type = db.Column(db.String(40))
    source = db.Column(db.String(20), default="manual")  # demo | manual | upload
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    def to_dict(self):
        return {"id": self.id, "text": self.text, "category": self.category, "department": self.department,
                "sentiment": self.sentiment, "confidence": round(self.confidence or 0, 4), "source": self.source,
                "date": self.created_at.strftime("%Y-%m-%d")}

class TrainingRun(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    dataset_size = db.Column(db.Integer)
    epochs = db.Column(db.Integer)
    train_accuracy = db.Column(db.Float)
    val_accuracy = db.Column(db.Float)
