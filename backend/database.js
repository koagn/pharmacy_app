const mysql = require('mysql2');

// Create connection pool (better for performance)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // XAMPP default is empty
    database: 'pharmacy_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert pool to use promises
const promisePool = pool.promise();

// Test connection
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log(' MySQL Database connected successfully');
        connection.release();
    } catch (error) {
        console.error(' Database connection failed:', error);
    }
};

testConnection();

module.exports = promisePool;