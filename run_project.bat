@echo off
cd /d "%~dp0"
start "CampusPulse Backend" cmd /k "cd backend && call ..\venv\Scripts\activate && python app.py"
start "CampusPulse Frontend" cmd /k "cd frontend && npm run dev"
echo Open http://localhost:5173
