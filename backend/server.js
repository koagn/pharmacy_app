// ============================================
// PHARMACY APP BACKEND - WITH IMAGE UPLOAD
// ============================================

const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CREATE UPLOADS DIRECTORY IF IT DOESN'T EXIST
// ============================================
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ============================================
// CONFIGURE MULTER FOR IMAGE UPLOADS
// ============================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'pharmacy-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// ============================================
// CORS CONFIGURATION
// ============================================
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://localhost:3000',
            'https://localhost:3001',
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

// Explicit headers for all responses
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    if (origin && (origin.includes('localhost:3000') || origin.includes('localhost:3001'))) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    
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

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
        console.log(' Registration attempt:', req.body.email);
        
        const { name, email, password, role, phone, pharmacyId } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

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
        console.log(' Password hashed successfully');

        let pharmacy_id = null;
        if (role === 'pharmacist' && pharmacyId) {
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

        console.log(' User inserted with ID:', result.insertId);

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
        console.error(' Registration error:', error);
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
        console.log(' Login attempt:', req.body.email);

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        const [rows] = await promisePool.execute(
            'SELECT id, name, email, password, role, phone, status, pharmacy_id FROM users WHERE email = ?',
            [normalizedEmail]
        );

        if (rows.length === 0) {
            console.log(' User not found:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = rows[0];

        console.log(' User found:', user.email, 'role:', user.role, 'pharmacy_id:', user.pharmacy_id);

        if (user.status && user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Your account is deactivated. Please contact admin.'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            console.log(' Invalid password for:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        console.log(' Password valid for:', email);

        const token = generateToken(user);
        delete user.password;

        let pharmacy = null;

        if (user.role === 'pharmacist' && user.pharmacy_id) {
            try {
                const [pharmacyRows] = await promisePool.execute(
                    'SELECT * FROM pharmacies WHERE id = ?',
                    [user.pharmacy_id]
                );
                if (pharmacyRows.length > 0) {
                    pharmacy = pharmacyRows[0];
                }
            } catch (lookupError) {
                console.error(' Error fetching pharmacy for pharmacist:', lookupError);
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
        console.error(' Login error:', error);
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

// GET ALL PHARMACIES (Public)
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
        console.error(' Get pharmacies error:', error);
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
        console.error(' Get pharmacy error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pharmacy',
            error: error.message
        });
    }
});

// CREATE PHARMACY WITH IMAGE UPLOAD
app.post('/api/pharmacies', upload.single('image'), async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pharmacy_app_secret_key_2024');
        
        const [users] = await promisePool.execute(
            'SELECT id, role, name FROM users WHERE id = ?',
            [decoded.id]
        );
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const user = users[0];
        
        if (user.role !== 'pharmacist') {
            return res.status(403).json({
                success: false,
                message: 'Only pharmacists can create pharmacies'
            });
        }
        
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
        
        const { name, location, address, phone, hours, manager, is_on_duty } = req.body;
        
        if (!name || !location) {
            return res.status(400).json({
                success: false,
                message: 'Pharmacy name and location are required'
            });
        }
        
        // Handle image upload
        let image_url = null;
        if (req.file) {
            image_url = `/uploads/${req.file.filename}`;
        }
        
        const [result] = await promisePool.execute(
            `INSERT INTO pharmacies (name, location, address, phone, hours, manager, user_id, status, is_on_duty, image_url, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, NOW())`,
            [name, location, address || null, phone || null, hours || '8h - 20h', manager || user.name, user.id, is_on_duty === 'true' || is_on_duty === true ? 1 : 0, image_url]
        );
        
        await promisePool.execute(
            'UPDATE users SET pharmacy_id = ? WHERE id = ?',
            [result.insertId, user.id]
        );
        
        const [pharmacyData] = await promisePool.execute(
            `SELECT * FROM pharmacies WHERE id = ?`,
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
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pharmacy_app_secret_key_2024');
        
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

// GET PHARMACY BY USER ID
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
        
        const [rows] = await promisePool.execute(`
            SELECT i.*, d.name, d.generic_name, d.category, d.manufacturer
            FROM inventory i
            JOIN drugs d ON i.drug_id = d.id
            WHERE i.pharmacy_id = ?
            ORDER BY i.expiry_date ASC
        `, [pharmacyId]);

        res.json({
            success: true,
            inventory: rows
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

// ADD ITEM TO INVENTORY
app.post('/api/pharmacies/:id/inventory', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pharmacy_app_secret_key_2024');
        const pharmacyId = req.params.id;
        
        // Verify pharmacy ownership
        const [pharmacy] = await promisePool.execute(
            'SELECT user_id FROM pharmacies WHERE id = ?',
            [pharmacyId]
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
                message: 'You can only manage your own pharmacy'
            });
        }
        
        const { name, generic_name, category, quantity, price, threshold, expiry_date, batch_number } = req.body;
        
        // First, check if drug exists in drugs table
        let [drug] = await promisePool.execute(
            'SELECT id FROM drugs WHERE name = ?',
            [name]
        );
        
        let drug_id;
        if (drug.length > 0) {
            drug_id = drug[0].id;
        } else {
            // Create new drug
            const [newDrug] = await promisePool.execute(
                'INSERT INTO drugs (name, generic_name, category) VALUES (?, ?, ?)',
                [name, generic_name || name, category || 'General']
            );
            drug_id = newDrug.insertId;
        }
        
        // Add to inventory
        const [result] = await promisePool.execute(
            `INSERT INTO inventory (pharmacy_id, drug_id, quantity, price, threshold, expiry_date, batch_number)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [pharmacyId, drug_id, quantity, price, threshold || 10, expiry_date || null, batch_number || null]
        );
        
        res.status(201).json({
            success: true,
            message: 'Drug added to inventory',
            inventory_id: result.insertId
        });
        
    } catch (error) {
        console.error('❌ Add to inventory error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add drug to inventory',
            error: error.message
        });
    }
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
        console.log(`✅ Pharmacies endpoint: http://localhost:${PORT}/api/pharmacies`);
        console.log(`✅ Uploads available at: http://localhost:${PORT}/uploads/`);
    }
});