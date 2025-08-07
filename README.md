# Angular File Upload Tool with Video Conversion

A comprehensive Angular application for file uploads with network sharing, video compression using HandBrake CLI, and an Okta-style homepage interface.

## 🚀 Features

- **File Upload System**: Drag & drop or click to upload files
- **Network Access**: Access from any device on the same network
- **Video Conversion**: Compress videos using HandBrake CLI
- **Recent Uploads**: View and manage uploaded files with sorting by date
- **File Management**: Download files, convert videos, and open folders
- **Progress Tracking**: Real-time upload and conversion progress
- **Cross-Platform**: Works on Linux (Kubuntu), with folder opening support

## 🛠️ Tech Stack

### Frontend
- **Angular 20** with standalone components
- **TypeScript** with strict mode
- **RxJS** for reactive programming
- **CSS** for styling with modern UI/UX

### Backend
- **Node.js** with Express
- **Multer** for file uploads
- **HandBrake CLI** for video compression
- **mime-types** for file type detection
- **CORS** for cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- Angular CLI (`npm install -g @angular/cli`)
- HandBrake CLI for video conversion:
  ```bash
  sudo apt install handbrake-cli  # Ubuntu/Debian
  ```

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/sangle173/angular_okta.git
   cd angular_okta
   ```

2. Install dependencies:
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. Start the application:
   ```bash
   # Start both frontend and backend
   ./start.sh
   
   # Or start individually:
   # Frontend: ng serve
   # Backend: cd backend && node server.js
   ```

4. Access the application:
   - Local: http://localhost:4200
   - Network: http://[your-ip]:4200

## � Usage

### File Upload
1. Navigate to the Upload page
2. Drag & drop files or click to select
3. Monitor upload progress
4. View files in the Recent Uploads section

### Video Conversion
1. Upload a video file (MP4, MOV, AVI)
2. Click the convert icon (🎬) next to the video
3. Monitor conversion progress
4. Download the compressed video from the Converts folder

### Network Access
- The application automatically detects your network IP
- Share the network URL with other devices on the same network
- Files uploaded from any device are accessible from all devices

### Folder Management
- Click "Open Uploads Folder" to view uploaded files in file manager
- Click "Open Converts Folder" to view converted videos
- Supports Linux file managers via xdg-open

## 📁 Project Structure

```
angular_okta/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/           # Okta-style homepage
│   │   │   └── upload/         # File upload interface
│   │   └── services/
│   │       ├── upload.ts       # File upload service
│   │       └── video-converter.ts
│   ├── index.html
│   └── main.ts
├── backend/
│   ├── server.js              # Express server
│   ├── package.json
│   └── uploads/              # Upload directory (auto-created)
├── start.sh                  # Start script
├── stop.sh                   # Stop script
└── README.md
```

## � Configuration

### Backend Server
- Port: 3000 (configurable via PORT environment variable)
- Upload directory: `~/Desktop/Uploads`
- Processed directory: `~/Desktop/Converts`
- File size limit: 500MB

### Angular App
- Port: 4200
- Automatic network IP detection
- Zoneless architecture (experimental)

## 🎨 UI Features

- **Modern Interface**: Clean, responsive design
- **File Icons**: Visual file type indicators
- **Progress Bars**: Real-time upload/conversion progress
- **Sorting**: Files sorted by creation date (newest first)
- **Action Icons**: Download and convert buttons with intuitive icons
- **Today's Highlights**: Green highlighting for files uploaded today

## 🐛 Troubleshooting

### Video Conversion Issues
- Ensure HandBrake CLI is installed: `handbrake --version`
- Check video file format compatibility
- Monitor server logs for conversion errors

### Network Access Issues
- Verify firewall settings allow port 3000 and 4200
- Check network connectivity between devices
- Ensure both frontend and backend are running

### File Upload Issues
- Check available disk space
- Verify upload directory permissions
- Check file size limits (500MB default)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**sangle173**
- Email: leducsang.10dt2@gmail.com
- GitHub: [@sangle173](https://github.com/sangle173)

---

Made with ❤️ using Angular and Node.js
