#!/bin/bash
export PATH=/opt/alt/alt-nodejs22/root/usr/bin:$PATH
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Kill all existing node server.js processes
for pid in $(pgrep -f "[n]ode server.js" 2>/dev/null); do
  [ "$pid" != "$$" ] && kill "$pid" 2>/dev/null
done
sleep 1

echo "" > app.log
PORT=5001 nohup node server.js </dev/null >> app.log 2>&1 &
echo "Started Node server on port 5001" >> app.log
