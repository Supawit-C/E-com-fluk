const db = require('../config/database');

/**
 * User Repository - Infrastructure Layer
 * Handles all direct database interactions for Users
 */
class UserRepository {
    static findByUsername(username) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static create(name, username, passwordHash) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO users (name, username, password_hash) VALUES (?, ?, ?)`;
            db.run(sql, [name, username, passwordHash], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }
}

module.exports = UserRepository;
