#!/bin/bash

echo "🚀 Starting Angular Tool Application..."
echo "======================================"

# Get local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')

# Function to check if port is in use
check_port() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port)
    if [ ! -z "$pids" ]; then
        echo "� Stopping existing process on port $port..."
        echo $pids | xargs kill -9 2>/dev/null
        sleep 2
    fi
}

# Check and kill existing processes
if check_port 3000; then
    echo "⚠️  Port 3000 is in use, stopping existing process..."
    kill_port 3000
fi

if check_port 4200; then
    echo "⚠️  Port 4200 is in use, stopping existing process..."
    kill_port 4200
fi

echo "�📡 Network Access URLs:"
echo "Frontend: http://$LOCAL_IP:4200"
echo "Backend:  http://$LOCAL_IP:3000"
echo "Upload:   http://$LOCAL_IP:4200/upload"
echo ""

# Check if HandBrake is installed
if ! command -v HandBrakeCLI &> /dev/null; then
    echo "⚠️  HandBrake CLI not found. Install with:"
    echo "   sudo apt install handbrake-cli"
    echo ""
fi

# Function to handle cleanup
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    kill_port 3000
    kill_port 4200
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Start backend server
echo "🔧 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Check if backend started successfully
if ! check_port 3000; then
    echo "❌ Backend failed to start on port 3000"
    exit 1
fi

# Start frontend server
echo "🌐 Starting frontend server..."
npm start &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
sleep 5

# Check if frontend started successfully
if ! check_port 4200; then
    echo "❌ Frontend failed to start on port 4200"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "✅ Both servers are running successfully!"
echo "🌍 Access the application at:"
echo "   http://localhost:4200 (local)"
echo "   http://$LOCAL_IP:4200 (network)"
echo "   http://$LOCAL_IP:4200/upload (direct upload)"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
