# Development Guide

## Quick Start

1. **Run everything with one command:**
   ```bash
   ./start.sh
   ```

2. **Stop all servers:**
   ```bash
   ./stop.sh
   ```

3. **Or start servers individually:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - Frontend  
   npm start
   ```

## Troubleshooting Port Issues

If you get "port already in use" errors:

1. **Use the stop script:**
   ```bash
   ./stop.sh
   ```

2. **Or manually kill processes:**
   ```bash
   # Kill processes on specific ports
   lsof -ti:3000,4200 | xargs -r kill -9
   
   # Or kill by process name
   pkill -f "ng serve"
   pkill -f "node server.js"
   ```

3. **Then restart:**
   ```bash
   ./start.sh
   ```

## Network URLs

Your application will be accessible at:
- **Local**: http://localhost:4200
- **Network**: http://172.18.100.149:4200/upload (example IP)

The startup script automatically detects your network IP address.

## Development Workflow

### Adding New Components
```bash
ng generate component components/new-feature
ng generate service services/new-service
```

### File Upload Testing
1. Start both servers
2. Navigate to `/upload`
3. Drag and drop files or click to browse
4. Monitor progress bars and conversion status

### Video Compression Testing
1. Upload MP4 or MOV files
2. Click "Compress Video" button after upload
3. Monitor conversion progress
4. Check `backend/processed/` for compressed files

## Backend API Endpoints

- `POST /api/upload` - Upload files
- `POST /api/convert-video` - Convert video files
- `GET /api/files` - List uploaded files
- `GET /api/network-info` - Get network information

## Project Architecture

```
Frontend (Angular) :4200
    ↓ HTTP requests
Backend (Node.js) :3000
    ↓ File operations
File System (uploads/, processed/)
    ↓ Video processing
HandBrake CLI
```

## Key Technologies

- **Frontend**: Angular 20, TypeScript, RxJS, Standalone Components
- **Backend**: Node.js, Express, Multer, HandBrake CLI
- **Styling**: CSS with gradients, responsive design
- **File Upload**: Drag & drop, progress tracking, error handling

## Debugging Tips

1. **Check browser console** for frontend errors
2. **Check terminal output** for backend logs
3. **Verify HandBrake installation**: `HandBrakeCLI --version`
4. **Test network access** from other devices
5. **Check file permissions** in uploads/ and processed/ folders

## Common Issues

### Upload not working
- Ensure backend server is running on port 3000
- Check CORS configuration in server.js
- Verify upload directory permissions

### Video conversion failing
- Install HandBrake CLI: `sudo apt install handbrake-cli`
- Check HandBrake CLI is in PATH
- Verify input file exists and is accessible

### Network access issues
- Check firewall settings
- Ensure servers are bound to 0.0.0.0
- Verify IP address detection in start.sh

### Angular Zone.js errors
If you see "RuntimeError: NG0908: In this configuration Angular requires Zone.js":
- Zone.js is configured in `angular.json` polyfills section
- Make sure `zone.js` is installed: `npm install zone.js`
- Restart the development server after changes

### Browser console errors
- Check for CORS issues between frontend (port 4200) and backend (port 3000)
- Verify all dependencies are installed
- Clear browser cache if issues persist
