const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const os = require('os');
const mime = require('mime-types');

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const desktopPath = path.join(os.homedir(), 'Desktop');
const uploadsDir = path.join(desktopPath, 'Uploads');
const processedDir = path.join(desktopPath, 'Converts');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', `http://${getLocalIP()}:4200`],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));
app.use('/processed', express.static(processedDir));

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: function (req, file, cb) {
    console.log('Uploading file:', file.originalname, 'Type:', file.mimetype);
    cb(null, true); // Accept all files
  }
});

// Get local network IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Routes
app.get('/api/network-info', (req, res) => {
  res.json({
    ip: getLocalIP(),
    port: PORT,
    uploadUrl: `http://${getLocalIP()}:${PORT}/api/upload`
  });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date()
    };

    console.log('File uploaded successfully:', fileInfo);
    res.json(fileInfo);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.post('/api/convert-video', (req, res) => {
  const { filename } = req.body;
  
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  const inputPath = path.join(uploadsDir, filename);
  const outputFilename = `compressed-${filename}`;
  const outputPath = path.join(processedDir, outputFilename);

  // Check if input file exists
  if (!fs.existsSync(inputPath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // HandBrake CLI command for video compression
  const handbrakeCmd = `HandBrakeCLI -i "${inputPath}" -o "${outputPath}" --preset="Fast 1080p30" --optimize`;

  console.log('Starting video conversion:', handbrakeCmd);

  exec(handbrakeCmd, (error, stdout, stderr) => {
    if (error) {
      console.error('HandBrake error:', error);
      return res.status(500).json({ error: 'Video conversion failed' });
    }

    // Get file sizes
    const originalStats = fs.statSync(inputPath);
    const compressedStats = fs.statSync(outputPath);

    const result = {
      originalSize: originalStats.size,
      compressedSize: compressedStats.size,
      originalFile: `/uploads/${filename}`,
      compressedFile: `/processed/${outputFilename}`,
      compressionRatio: Math.round((1 - compressedStats.size / originalStats.size) * 100)
    };

    console.log('Video conversion completed:', result);
    res.json(result);
  });
});

app.get('/api/files', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir).map(filename => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      return {
        name: filename,
        size: stats.size,
        url: `/uploads/${filename}`,
        uploadedAt: stats.mtime,
        mimetype: mime.lookup(filename) || 'application/octet-stream'
      };
    });

    res.json(files);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Open folders endpoints
app.post('/api/open-uploads-folder', (req, res) => {
  try {
    // Use xdg-open for Linux (works on Kubuntu)
    exec(`xdg-open "${uploadsDir}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error opening uploads folder:', error);
        return res.status(500).json({ error: 'Failed to open uploads folder' });
      }
      res.json({ success: true, message: 'Uploads folder opened' });
    });
  } catch (error) {
    console.error('Error opening uploads folder:', error);
    res.status(500).json({ error: 'Failed to open uploads folder' });
  }
});

app.post('/api/open-converts-folder', (req, res) => {
  try {
    // Use xdg-open for Linux (works on Kubuntu)
    exec(`xdg-open "${processedDir}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error opening converts folder:', error);
        return res.status(500).json({ error: 'Failed to open converts folder' });
      }
      res.json({ success: true, message: 'Converts folder opened' });
    });
  } catch (error) {
    console.error('Error opening converts folder:', error);
    res.status(500).json({ error: 'Failed to open converts folder' });
  }
});

// Serve static files for network access
app.get('/', (req, res) => {
  res.json({
    message: 'Angular Tool Backend Server',
    uploadEndpoint: '/api/upload',
    networkAccess: `http://${getLocalIP()}:${PORT}`,
    status: 'running'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log(`
🚀 Angular Tool Backend Server is running!

Local:    http://localhost:${PORT}
Network:  http://${localIP}:${PORT}

Upload endpoint: http://${localIP}:${PORT}/api/upload
Files endpoint:  http://${localIP}:${PORT}/api/files

Note: Make sure HandBrake CLI is installed for video conversion.
Install with: sudo apt install handbrake-cli
  `);
});

module.exports = app;
