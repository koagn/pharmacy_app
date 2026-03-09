// ============================================
// PHARMACY APP BACKEND - LOGIN & REGISTRATION ONLY
// ==========
/// ============================================
// PHARMACY APP BACKEND - LOGIN & REGISTRATION ONLY
// ============================================

const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CORS CONFIGURATION - FIXED FOR PORT 3001
// ============================================
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        
        // Allow these origins - INCLUDING HTTPS VARIATIONS
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://localhost:3000',  // Added HTTPS version
            'https://localhost:3001',   // Added HTTPS version
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('❌ Blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Explicit headers for all responses - FIXED to use dynamic origin
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Dynamically set the allowed origin based on request
    if (origin && (
        origin.includes('localhost:3000') || 
        origin.includes('localhost:3001')
    )) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return res.status(200).json({
            message: 'CORS preflight successful',
            allowedOrigin: origin
        });
    }
    
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// DATABASE CONNECTION (XAMPP)
// ============================================
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pharmacy_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ MySQL Database connected successfully');
        console.log('📊 Database:', process.env.DB_NAME);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

// ============================================
// HELPER FUNCTION - Generate JWT Token
// ============================================
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'pharmacy_app_secret_key_2024',
        { expiresIn: '7d' }
    );
};

// ============================================
// REGISTER ENDPOINT
// ============================================
app.post('/api/auth/register', async (req, res) => {
    try {
        console.log('📝 Registration attempt:', req.body.email);
        
        const { name, email, password, role, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        const [existingUsers] = await promisePool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('🔐 Password hashed successfully');

        const [result] = await promisePool.execute(
            'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'patient', phone || '']
        );

        console.log('✅ User inserted with ID:', result.insertId);

        const [newUser] = await promisePool.execute(
            'SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?',
            [result.insertId]
        );

        const token = generateToken(newUser[0]);

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            user: newUser[0],
            token
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// ============================================
// LOGIN ENDPOINT
// ============================================
app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('🔑 Login attempt:', req.body.email);
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const [rows] = await promisePool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = rows[0];
        console.log('✅ User found:', user.email);

        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Your account is deactivated. Please contact admin.'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            console.log('❌ Invalid password for:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        console.log('✅ Password valid for:', email);

        const token = generateToken(user);
        delete user.password;

        res.json({
            success: true,
            message: 'Login successful!',
            user,
            token
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

// ============================================
// TEST ENDPOINT
// ============================================
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Backend server is running!',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, async () => {
    console.log(`🚀 Server starting on port ${PORT}`);
    console.log(`🌐 Test: http://localhost:${PORT}/api/test`);
    
    const dbConnected = await testConnection();
    
    if (dbConnected) {
        console.log(`✅ Login endpoint: http://localhost:${PORT}/api/auth/login`);
        console.log(`✅ Register endpoint: http://localhost:${PORT}/api/auth/register`);
    }
});