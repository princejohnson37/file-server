const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 4000;

// Enable CORS for all routes
app.use(cors());

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to the filename
  },
});

const upload = multer({ storage: storage });

// Middleware for logging incoming requests
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Middleware for logging file uploads
app.use('/upload', (req, res, next) => {
  console.log(`File Upload Request: ${req.method} ${req.url}`);
  next();
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Set up a route for handling file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  // 'file' corresponds to the field name in the HTML form
  console.log('File uploaded successfully:', req.file);
  res.json({ message: 'File uploaded successfully' });
});

// Middleware for logging responses
app.use((req, res, next) => {
  console.log(`Response Status: ${res.statusCode}`);
  next();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
