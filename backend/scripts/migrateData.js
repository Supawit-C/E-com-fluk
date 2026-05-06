const fs = require('fs');
const path = require('path');
const db = require('../config/database');

const migrateData = async () => {
    console.log('Starting data migration...');

    // 1. Migrate Products
    const productsPath = path.join(__dirname, '../data/products.json');
    if (fs.existsSync(productsPath)) {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        const stmt = db.prepare('INSERT OR REPLACE INTO products (id, name, price, sale_tag, image, category, stock) VALUES (?, ?, ?, ?, ?, ?, ?)');
        
        products.forEach(p => {
            stmt.run(p.id, p.name, p.price, p.sale_tag, p.image, p.category, p.stock);
        });
        stmt.finalize();
        console.log(`Migrated ${products.length} products.`);
    }

    // 2. Migrate Users (from both users.json and auth_user.json)
    const userFiles = ['users.json', 'auth_user.json'];
    let totalUsers = 0;

    const userStmt = db.prepare('INSERT OR IGNORE INTO users (id, name, username, password_hash) VALUES (?, ?, ?, ?)');

    userFiles.forEach(file => {
        const filePath = path.join(__dirname, '../data/', file);
        if (fs.existsSync(filePath)) {
            const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            users.forEach(u => {
                // Handle different field names (first_name vs name)
                const name = u.name || u.first_name || 'User';
                userStmt.run(u.id, name, u.username, u.password_hash);
                totalUsers++;
            });
        }
    });

    userStmt.finalize();
    console.log(`Migrated ${totalUsers} users.`);

    console.log('Migration complete. You can now use store.db for all operations.');
};

// Run the migration
// We wait a bit to ensure tables are created (db.serialize in config might still be running)
setTimeout(migrateData, 1000);
