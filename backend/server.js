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
        
        const { name, email, password, role, phone, pharmacyId } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        // Normalize email to lowercase for consistency
        const normalizedEmail = String(email).trim().toLowerCase();

        const [existingUsers] = await promisePool.execute(
            'SELECT id FROM users WHERE email = ?',
            [normalizedEmail]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('🔐 Password hashed successfully');

        // Handle pharmacy assignment for pharmacists
        let pharmacy_id = null;
        if (role === 'pharmacist' && pharmacyId) {
            // Verify the pharmacy exists
            const [pharmacyCheck] = await promisePool.execute(
                'SELECT id FROM pharmacies WHERE id = ?',
                [pharmacyId]
            );
            
            if (pharmacyCheck.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Selected pharmacy does not exist'
                });
            }
            
            pharmacy_id = pharmacyId;
        }

        const [result] = await promisePool.execute(
            'INSERT INTO users (name, email, password, role, phone, pharmacy_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, normalizedEmail, hashedPassword, role || 'patient', phone || '', pharmacy_id]
        );

        console.log('✅ User inserted with ID:', result.insertId);

        const [newUser] = await promisePool.execute(
            'SELECT id, name, email, role, phone, pharmacy_id, created_at FROM users WHERE id = ?',
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
// ============================================
// LOGIN ENDPOINT (UPDATED)
// ============================================
app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('🔑 Login attempt', { body: req.body });

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // ensure correct format
        const normalizedEmail = String(email).trim().toLowerCase();

        const [rows] = await promisePool.execute(
            'SELECT id, name, email, password, role, phone, status, pharmacy_id FROM users WHERE email = ?',
            [normalizedEmail]
        );

        if (rows.length === 0) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = rows[0];

        console.log('✅ User found:', user.email, 'role:', user.role, 'pharmacy_id:', user.pharmacy_id);

        if (user.status && user.status !== 'active') {
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

        let pharmacy = null;

        if (user.role === 'pharmacist' && user.pharmacy_id !== null && user.pharmacy_id !== undefined) {
            const pharmacyIdInt = parseInt(user.pharmacy_id, 10);
            if (!Number.isNaN(pharmacyIdInt) && isFinite(pharmacyIdInt)) {
                try {
                    const [pharmacyRows] = await promisePool.execute(
                        'SELECT id, name, location, address, phone, hours, manager, status FROM pharmacies WHERE id = ?',
                        [pharmacyIdInt]
                    );
                    if (pharmacyRows.length > 0) {
                        pharmacy = pharmacyRows[0];
                    }
                } catch (lookupError) {
                    console.error('❌ Error fetching pharmacy for pharmacist:', lookupError);
                }
            } else {
                console.warn('⚠️ pharmacist has invalid pharmacy_id:', user.pharmacy_id);
            }
        }

        res.json({
            success: true,
            message: 'Login successful!',
            user: {
                ...user,
                pharmacy
            },
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
// PHARMACY ENDPOINTS
// ============================================

// GET ALL PHARMACIES (Public - anyone can view)
app.get('/api/pharmacies', async (req, res) => {
    try {
        const [rows] = await promisePool.execute(`
            SELECT p.*, u.name as manager_name, u.email as manager_email
            FROM pharmacies p
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.status = 'active'
            ORDER BY p.name ASC
        `);
        
        res.json({
            success: true,
            pharmacies: rows
        });
    } catch (error) {
        console.error('❌ Get pharmacies error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pharmacies',
            error: error.message
        });
    }
});

// GET SINGLE PHARMACY BY ID
app.get('/api/pharmacies/:id', async (req, res) => {
    try {
        const [rows] = await promisePool.execute(`
            SELECT p.*, u.name as manager_name, u.email as manager_email
            FROM pharmacies p
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.id = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pharmacy not found'
            });
        }
        
        res.json({
            success: true,
            pharmacy: rows[0]
        });
    } catch (error) {
        console.error('❌ Get pharmacy error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pharmacy',
            error: error.message
        });
    }
});

// CREATE PHARMACY (Only for authenticated pharmacists)
app.post('/api/pharmacies', async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pharmacy_app_secret_key_2024');
        
        // Get user info
        const [users] = await promisePool.execute(
            'SELECT id, role FROM users WHERE id = ?',
            [decoded.id]
        );
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const user = users[0];
        
        // Check if user is a pharmacist
        if (user.role !== 'pharmacist') {
            return res.status(403).json({
                success: false,
                message: 'Only pharmacists can create pharmacies'
            });
        }
        
        // Check if user already has a pharmacy
        const [existingPharmacy] = await promisePool.execute(
            'SELECT id FROM pharmacies WHERE user_id = ?',
            [user.id]
        );
        
        if (existingPharmacy.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pharmacy registered'
            });
        }
        
        const { name, location, address, phone, hours, manager } = req.body;
        
        if (!name || !location) {
            return res.status(400).json({
                success: false,
                message: 'Pharmacy name and location are required'
            });
        }
        
        const [result] = await promisePool.execute(
            `INSERT INTO pharmacies (name, location, address, phone, hours, manager, user_id, status, is_on_duty, image, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, NOW())`,
            [name, location, address || null, phone || null, hours || '8h - 20h', manager || user.name, user.id, req.body.is_on_duty ? 1 : 0, req.body.image || null]
        );
        
        // Update user's pharmacy_id
        await promisePool.execute(
            'UPDATE users SET pharmacy_id = ? WHERE id = ?',
            [result.insertId, user.id]
        );
        
        // Fetch and return the complete pharmacy object
        const [pharmacyData] = await promisePool.execute(
            `SELECT p.*, u.name as manager_name, u.email as manager_email
             FROM pharmacies p
             LEFT JOIN users u ON p.user_id = u.id
             WHERE p.id = ?`,
            [result.insertId]
        );
        
        res.status(201).json({
            success: true,
            message: 'Pharmacy created successfully!',
            pharmacy: pharmacyData[0]
        });
        
    } catch (error) {
        console.error('❌ Create pharmacy error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create pharmacy',
            error: error.message
        });
    }
});

// UPDATE PHARMACY (Only the owner pharmacist can update)
app.put('/api/pharmacies/:id', async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pharmacy_app_secret_key_2024');
        
        // Check if pharmacy exists and user owns it
        const [pharmacy] = await promisePool.execute(
            'SELECT * FROM pharmacies WHERE id = ?',
            [req.params.id]
        );
        
        if (pharmacy.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pharmacy not found'
            });
        }
        
        if (pharmacy[0].user_id !== decoded.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own pharmacy'
            });
        }
        
        const { name, location, address, phone, hours, is_on_duty, manager } = req.body;
        
        await promisePool.execute(
            `UPDATE pharmacies 
             SET name = COALESCE(?, name),
                 location = COALESCE(?, location),
                 address = COALESCE(?, address),
                 phone = COALESCE(?, phone),
                 hours = COALESCE(?, hours),
                 is_on_duty = COALESCE(?, is_on_duty),
                 manager = COALESCE(?, manager)
             WHERE id = ?`,
            [name, location, address, phone, hours, is_on_duty, manager, req.params.id]
        );
        
        res.json({
            success: true,
            message: 'Pharmacy updated successfully'
        });
        
    } catch (error) {
        console.error('❌ Update pharmacy error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update pharmacy',
            error: error.message
        });
    }
});

// GET PHARMACY BY USER ID (for pharmacist dashboard)
app.get('/api/pharmacies/user/:userId', async (req, res) => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT * FROM pharmacies WHERE user_id = ?',
            [req.params.userId]
        );
        
        res.json({
            success: true,
            pharmacy: rows.length > 0 ? rows[0] : null
        });
    } catch (error) {
        console.error('❌ Get user pharmacy error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pharmacy',
            error: error.message
        });
    }
});

// GET PHARMACY INVENTORY
app.get('/api/pharmacies/:id/inventory', async (req, res) => {
    try {
        const pharmacyId = req.params.id;
        
        // For now, return empty inventory since inventory table structure isn't defined
        // This endpoint can be expanded later when inventory management is fully implemented
        res.json({
            success: true,
            inventory: []
        });
    } catch (error) {
        console.error('❌ Get inventory error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inventory',
            error: error.message
        });
    }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, async () => {
    console.log(` Server starting on port ${PORT}`);
    console.log(` Test: http://localhost:${PORT}/api/test`);
    
    const dbConnected = await testConnection();
    
    if (dbConnected) {
        console.log(`✅ Login endpoint: http://localhost:${PORT}/api/auth/login`);
        console.log(`✅ Register endpoint: http://localhost:${PORT}/api/auth/register`);
    }
});