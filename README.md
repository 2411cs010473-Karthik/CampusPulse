# CampusPulse AI – University Feedback Analytics
React + Vite + Tailwind + Recharts | Flask + SQLAlchemy + SQLite | Keras LSTM sentiment model.
**All data is synthetic (template-generated) demonstration data.**

Demo login: `admin@campuspulse.edu` / `Admin@123`

## Run (Windows CMD, Python 3.10-3.12 required for TensorFlow 2.16)
```
cd unipulse-ai
python -m venv venv
venv\Scripts\activate
pip install -r backend\requirements.txt
cd backend
python train_model.py
python app.py
```
New terminal:
```
cd unipulse-ai\frontend
npm install
npm run dev
```
Open http://localhost:5173. Or, after the first-time setup above, double-click `run_project.bat`.

## Notes
- Run `train_model.py` BEFORE `app.py`: demo feedback is predicted and stored at first start. If you started the app before training, stop it, delete `backend\unipulse.db`, and start again.
- Without a trained LSTM the backend uses a labelled DEMO FALLBACK (TF-IDF + logistic regression, not deep learning); the UI shows a banner and /api/health reports `lstm_trained: false`.
- Accuracy on synthetic template data is optimistic and does not predict real-world performance.
- Keyword insights (term frequency) are separate from LSTM sentiment predictions.
- Sample CSV: `sample_data/university_feedback.csv` (150 rows). Upload categories/departments must match the dropdown values.
