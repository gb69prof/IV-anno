@echo off
cd /d "%~dp0"
start "Foscolo 3D Server" cmd /k python -m http.server 8000 --bind 0.0.0.0
ping 127.0.0.1 -n 3 > nul
start http://localhost:8000
