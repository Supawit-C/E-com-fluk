const db = require('../config/database');

/**
 * Order Repository - Infrastructure Layer
 * Handles all direct database interactions for Orders and Order Items
 */
class OrderRepository {
    static createOrderWithItems(name, email, address, total, cartItems) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                db.run(
                    `INSERT INTO orders (name, email, address, total_price) VALUES (?, ?, ?, ?)`,
                    [name, email, address, total],
                    function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            return reject(err);
                        }
                        
                        const orderId = this.lastID;
                        const stmt = db.prepare(`INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`);
                        
                        let hasError = false;
                        for (const item of cartItems) {
                            stmt.run([orderId, item.id, item.quantity, item.price], (errItem) => {
                                if (errItem && !hasError) {
                                    hasError = true;
                                    db.run('ROLLBACK');
                                    reject(errItem);
                                }
                            });
                        }
                        
                        stmt.finalize((errStmt) => {
                            if (hasError) return;
                            if (errStmt) {
                                db.run('ROLLBACK');
                                return reject(errStmt);
                            }
                            db.run('COMMIT');
                            resolve(orderId);
                        });
                    }
                );
            });
        });
    }
}

module.exports = OrderRepository;
