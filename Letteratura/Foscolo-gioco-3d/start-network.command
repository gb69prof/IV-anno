#!/bin/bash
cd "$(dirname "$0")"
PORT=8000
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "IP_DEL_COMPUTER")
python3 -m http.server "$PORT" --bind 0.0.0.0 &
SERVER_PID=$!
sleep 1
open "http://localhost:$PORT"
echo "Sul computer: http://localhost:$PORT"
echo "Sull'iPad, stessa rete Wi-Fi: http://$IP:$PORT"
echo "Per chiudere il server premi Ctrl+C."
trap 'kill $SERVER_PID 2>/dev/null' EXIT
wait $SERVER_PID
