const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/departments', require('./routes/departments'));

// Determine the correct path for static files
let staticPath;
if (process.env.NODE_ENV === 'production') {
    // In production, serve from the public directory inside backend
    staticPath = path.join(__dirname, 'public');
    // Create public directory if it doesn't exist
    if (!fs.existsSync(staticPath)) {
        fs.mkdirSync(staticPath, { recursive: true });
    }
} else {
    // In development, serve from the frontend directory
    staticPath = path.join(__dirname, '../frontend');
}

console.log('Serving static files from:', staticPath);

// Serve static files
app.use(express.static(staticPath));

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
    const indexPath = path.join(staticPath, 'index.html');
    console.log('Attempting to serve:', indexPath);
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error('index.html not found at:', indexPath);
        res.status(404).json({ error: 'File not found' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
}); 
