@echo off
echo Starting Student ID System...

:: Start the Express backend
cd microservices
start cmd /k "npm start"

:: Wait for backend to initialize
timeout /t 5

:: Start the Streamlit frontend
cd ../ui
start cmd /k "streamlit run app.py"

echo Both applications have been started!
echo Backend running at: http://localhost:3000
echo Frontend running at: http://localhost:8501
