const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sandeep-builders-secret-key-change-in-production';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve files from current directory
app.use('/uploads', express.static(uploadsDir));

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Simple in-memory storage (for demo purposes)
// In production, use a database like MongoDB or PostgreSQL
let contentStore = {
    text: {},
    images: {}
};

let adminStore = {
    email: 'sandeepbuilders000@gmail.com',
    password: null // Will be set on first run
};

// Initialize admin password
const initializeAdmin = async () => {
    const defaultPassword = '@deep8079';
    adminStore.password = await bcrypt.hash(defaultPassword, 10);
    console.log('Admin initialized with default credentials:');
    console.log('Email: sandeepbuilders000@gmail.com');
    console.log('Password: @deep8079');
    console.log('Please change these in production!');
};

initializeAdmin();

// Load content from file if exists
const contentFilePath = path.join(__dirname, 'content.json');
if (fs.existsSync(contentFilePath)) {
    try {
        const data = fs.readFileSync(contentFilePath, 'utf8');
        contentStore = JSON.parse(data);
        console.log('Content loaded from file');
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Save content to file
const saveContentToFile = () => {
    try {
        fs.writeFileSync(contentFilePath, JSON.stringify(contentStore, null, 2));
        console.log('Content saved to file');
    } catch (error) {
        console.error('Error saving content:', error);
    }
};

// Routes

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Content routes
app.get('/api/content', (req, res) => {
    res.json(contentStore);
});

app.post('/api/content', authenticateToken, (req, res) => {
    const { text, images } = req.body;
    
    if (text) {
        contentStore.text = { ...contentStore.text, ...text };
    }
    
    if (images) {
        contentStore.images = { ...contentStore.images, ...images };
    }
    
    saveContentToFile();
    res.json({ success: true, message: 'Content saved successfully' });
});

// Image upload
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
});

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (email !== adminStore.email) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, adminStore.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ email: adminStore.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token });
});

app.post('/api/auth/setup', async (req, res) => {
    const { email, password, name } = req.body;
    
    // Only allow setup if admin doesn't exist or with special setup key
    if (adminStore.email && req.body.setupKey !== 'sandeep-builders-setup') {
        return res.status(400).json({ error: 'Admin already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    adminStore = {
        email,
        password: hashedPassword,
        name
    };
    
    res.json({ success: true, message: 'Admin created successfully' });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, phone, service, message } = req.body;
    
    // Allowed emails for contact form
    const allowedEmails = ['shivrameena7999@gmail.com', 'sandeepbuilders000@gmail.com'];
    
    // Validate email
    if (!allowedEmails.includes(email)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Only emails from shivrameena7999@gmail.com or sandeepbuilders000@gmail.com are allowed' 
        });
    }
    
    // Log the contact submission
    console.log('Contact Form Submission:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Service:', service);
    console.log('Message:', message);
    
    // In production, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send confirmation email to user
    
    res.json({ success: true, message: 'Contact form submitted successfully' });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin credentials: admin@sandeepbuilders.com / admin123`);
    console.log('Double-click the logo to access admin login');
});