const db = require('../config/database');

/**
 * Order Repository - Infrastructure Layer
 * Handles all direct database interactions for Orders and Order Items
 */
class OrderRepository {
    static createOrder(name, email, address, total) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO orders (name, email, address, total_price) VALUES (?, ?, ?, ?)`;
            db.run(sql, [name, email, address, total], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }

    static createOrderItem(orderId, productId, quantity, price) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
            db.run(sql, [orderId, productId, quantity, price], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = OrderRepository;
