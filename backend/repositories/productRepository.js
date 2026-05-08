const db = require('../config/database');

/**
 * Product Repository - Infrastructure Layer
 * Handles all direct database interactions for Products
 */
class ProductRepository {
    static findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM products', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static findByName(name) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM products WHERE name = ?', [name], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
}

module.exports = ProductRepository;
