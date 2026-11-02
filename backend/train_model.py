"""Trains the LSTM sentiment model on SYNTHETIC data. Run: python train_model.py"""
import json, os
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import confusion_matrix
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.callbacks import EarlyStopping
from preprocessing import clean_text, MAX_LEN, VOCAB_SIZE
from synthetic import make_samples
from model import build_model

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "saved_model"); os.makedirs(D, exist_ok=True)
EPOCHS = 20

def main():
    rows = make_samples(1500, seed=1)
    texts = [clean_text(r["feedback"]) for r in rows]
    le = LabelEncoder(); y = le.fit_transform([r["label"] for r in rows])
    tok = Tokenizer(num_words=VOCAB_SIZE, oov_token="<OOV>"); tok.fit_on_texts(texts)
    X = pad_sequences(tok.texts_to_sequences(texts), maxlen=MAX_LEN, padding="post")
    Xtr, Xva, ytr, yva = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
    model = build_model(len(le.classes_))
    h = model.fit(Xtr, ytr, validation_data=(Xva, yva), epochs=EPOCHS, batch_size=32, verbose=2,
                  callbacks=[EarlyStopping(patience=4, restore_best_weights=True)])
    pred = model.predict(Xva, verbose=0).argmax(1)
    summary = []; model.summary(print_fn=summary.append)
    metrics = {"model_type": "LSTM", "classes": list(le.classes_), "dataset_size": len(rows), "train_size": len(Xtr), "val_size": len(Xva),
               "epochs_run": len(h.history["loss"]), "train_accuracy": float(h.history["accuracy"][-1]), "val_accuracy": float(h.history["val_accuracy"][-1]),
               "history": {k: [float(v) for v in vals] for k, vals in h.history.items()},
               "confusion_matrix": confusion_matrix(yva, pred).tolist(), "architecture": summary,
               "data_note": "Synthetic template-generated data; accuracy is optimistic and not a real-world estimate."}
    model.save(os.path.join(D, "lstm_model.keras"))
    open(os.path.join(D, "tokenizer.json"), "w").write(tok.to_json())
    json.dump({"classes": list(le.classes_)}, open(os.path.join(D, "labels.json"), "w"))
    json.dump(metrics, open(os.path.join(D, "metrics.json"), "w"), indent=1)
    print(f"\nTRAIN acc={metrics['train_accuracy']:.4f}  VAL acc={metrics['val_accuracy']:.4f}  saved to {D}")

if __name__ == "__main__":
    main()
