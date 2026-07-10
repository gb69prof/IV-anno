#!/bin/bash
cd "$(dirname "$0")"
PORT=8000
python3 -m http.server "$PORT" --bind 0.0.0.0 &
SERVER_PID=$!
sleep 1
open "http://localhost:$PORT"
echo "Foscolo 3D è in esecuzione su http://localhost:$PORT"
echo "Per chiudere il server premi Ctrl+C."
trap 'kill $SERVER_PID 2>/dev/null' EXIT
wait $SERVER_PID
