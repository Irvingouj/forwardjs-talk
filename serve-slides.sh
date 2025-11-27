#!/bin/bash
# Serve the presentation slides and auto-reload when index.html changes

set -e

cd "$(dirname "$0")/slides"

PORT=8080

start_server() {
	npx -y http-server -p "$PORT" -o .
}

cleanup() {
	jobs -p | xargs -r kill 2>/dev/null || true
}

trap cleanup EXIT

start_server &
SERVER_PID=$!

if command -v inotifywait >/dev/null 2>&1; then
	while inotifywait -e close_write ./index.html >/dev/null 2>&1; do
		kill "$SERVER_PID" 2>/dev/null || true
		start_server &
		SERVER_PID=$!
	done
else
	echo "inotifywait not found; install with: sudo apt-get install -y inotify-tools" >&2
	wait "$SERVER_PID"
fi
