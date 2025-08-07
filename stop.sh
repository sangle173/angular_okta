#!/bin/bash

echo "🛑 Stopping Angular Tool servers..."

# Function to kill process on port
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo "Stopping process on port $port..."
        echo $pids | xargs kill -9 2>/dev/null
    fi
}

# Kill processes on both ports
kill_port 3000
kill_port 4200

# Also kill by process name
pkill -f "ng serve" 2>/dev/null
pkill -f "node server.js" 2>/dev/null
pkill -f "npm start" 2>/dev/null

echo "✅ All servers stopped!"
