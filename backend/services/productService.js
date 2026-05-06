const db = require('../config/database');

/**
 * Service สำหรับดึงสินค้าทั้งหมดจาก SQLite
 */
const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM products', [], (err, rows) => {
            if (err) {
                console.error('DB Error (getAllProducts):', err);
                reject(new Error('Could not read product database'));
            } else {
                resolve(rows);
            }
        });
    });
};

/**
 * Service สำหรับดึงข้อมูลสินค้าหมวกโดยเฉพาะ
 */
const getHatProduct = () => {
    return new Promise((resolve, reject) => {
        // ค้นหาหมวกที่ชื่อ "Cool Hat" ในตาราง products
        db.get('SELECT * FROM products WHERE name = ?', ['Cool Hat'], (err, row) => {
            if (err) {
                console.error('DB Error (getHatProduct):', err);
                reject(new Error('Could not find Hat product'));
            } else {
                resolve(row);
            }
        });
    });
};

module.exports = {
    getAllProducts,
    getHatProduct
};
