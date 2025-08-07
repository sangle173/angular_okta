# Angular Tool

This is a modern Angular project created with [Angular CLI](https://github.com/angular/angular-cli) version 20.1.4.

## Key Features
- **Modern Angular Architecture**: Uses Angular 20 with traditional Zone.js for stable change detection
- **Standalone Components**: Built with standalone components (no NgModules)
- **TypeScript**: Full TypeScript support with strict mode enabled
- **Angular Router**: Configured for single-page application routing
- **Modern Tooling**: Includes VS Code configuration, ESLint, Prettier, and Karma testing

## 🚀 File Upload Features
- **Network File Sharing**: Upload files accessible across your local network
- **Progress Tracking**: Real-time upload progress with visual progress bars
- **Video Compression**: Automatic video compression using HandBrake CLI for MP4/MOV files
- **Drag & Drop**: Intuitive drag-and-drop file upload interface
- **Multiple File Support**: Upload multiple files simultaneously
- **File Management**: View recent uploads and download files

## 🏠 Okta-Style Homepage
- Clean, professional interface inspired by Okta's design
- Application grid with future expansion capabilities
- Responsive design for desktop and mobile devices
- Centralized navigation for multiple applications

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v18 or higher)
2. **Angular CLI** (v20 or higher)
3. **HandBrake CLI** for video compression:
   ```bash
   sudo apt install handbrake-cli  # Ubuntu/Debian
   brew install handbrake          # macOS
   ```

## 🔧 Setup & Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd angular_tool
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```
   The backend will be available at:
   - Local: `http://localhost:3000`
   - Network: `http://[your-ip]:3000`

4. **Start the Angular development server:**
   ```bash
   npm start
   ```
   The application will be available at:
   - Local: `http://localhost:4200`
   - Network: `http://[your-ip]:4200`

## 🌐 Network Access

The application is configured to accept connections from other devices on your local network:

- **Frontend**: `http://[your-ip]:4200`
- **Backend**: `http://[your-ip]:3000`

Other devices can access the upload page directly at: `http://[your-ip]:4200/upload`

## 📁 Project Structure

```
angular_tool/
├── .github/
│   └── copilot-instructions.md    # Copilot workspace instructions
├── .vscode/                       # VS Code configuration
├── backend/                       # Node.js backend server
│   ├── server.js                  # Express server with file upload
│   ├── uploads/                   # Uploaded files storage
│   └── processed/                 # Compressed video files
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/              # Okta-style homepage
│   │   │   └── upload/            # File upload interface
│   │   └── services/
│   │       ├── upload.ts          # File upload service
│   │       └── video-converter.ts # Video compression service
│   └── ...
└── ...
```

## 🎬 Video Compression

The application automatically detects video files (MP4, MOV) and offers compression using HandBrake CLI:

- **Compression Settings**: Fast 1080p30 preset for optimal size/quality balance
- **Progress Tracking**: Real-time conversion status
- **File Size Comparison**: Shows original vs compressed file sizes
- **Storage**: Compressed files are stored in `backend/processed/`

## 🔨 Available Scripts

### Frontend
- `npm start` - Start development server (accessible on network)
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `ng generate component <name>` - Generate new component

### Backend
- `cd backend && npm start` - Start file upload server
- `cd backend && npm run dev` - Start with nodemon for development

## 🛠️ Development Commands

```bash
# Generate new component
ng generate component components/new-component

# Generate new service
ng generate service services/new-service

# Build for production
ng build --configuration production

# Run tests
ng test
```

## 🔧 Configuration

### Network Configuration
The backend automatically detects your local IP address and configures CORS accordingly. No manual configuration needed.

### Upload Configuration
- **Max file size**: 500MB per file
- **Supported formats**: All file types
- **Video compression**: MP4, MOV, AVI
- **Storage location**: `backend/uploads/` and `backend/processed/`

## 🚀 Deployment

For production deployment:

1. Build the Angular application:
   ```bash
   ng build --configuration production
   ```

2. Configure your web server to serve the `dist/` folder
3. Run the backend server with a process manager like PM2:
   ```bash
   npm install -g pm2
   cd backend
   pm2 start server.js --name angular-tool-backend
   ```

## 🎯 Future Features

The homepage is designed to accommodate additional applications:
- Analytics dashboard
- User management
- Security monitoring
- Mobile device sync
- And more...

## 📋 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
