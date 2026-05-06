const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to database file
const dbPath = path.join(__dirname, '../data/store.db');

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database (store.db).');
        initializeDatabase();
    }
});

// Initialize tables
function initializeDatabase() {
    // Orders Table (Header info)
    const createOrdersTable = `
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            address TEXT NOT NULL,
            total_price DECIMAL(10, 2) NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // Order Items Table (Line items)
    const createOrderItemsTable = `
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders (id)
        )
    `;

    // Users Table
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // Products Table
    const createProductsTable = `
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            sale_tag TEXT,
            image TEXT,
            category TEXT,
            stock INTEGER DEFAULT 0
        )
    `;

    db.serialize(() => {
        db.run(createOrdersTable);
        db.run(createOrderItemsTable);
        db.run(createUsersTable);
        db.run(createProductsTable, (err) => {
            if (err) console.error('Error initializing database tables:', err.message);
            else console.log('Database tables ready.');
        });
    });
}

module.exports = db;
