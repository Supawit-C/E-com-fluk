const fs = require('fs');
const path = require('path');

// Path to the local JSON data
const productsFilePath = path.join(__dirname, '../data/products.json');

/**
 * Service to handle data logic (Reading JSON)
 */
const getAllProducts = () => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('Could not read product database');
    }
};

/**
 * Service สำหรับดึงข้อมูลหมวกโดยเฉพาะ
 */
const getHatProduct = () => {
    try {
        const products = getAllProducts();
        // ค้นหาหมวกที่ชื่อ "Cool Hat" ในฐานข้อมูล JSON
        return products.find(p => p.name === 'Cool Hat');
    } catch (error) {
        throw new Error('Could not find Hat product');
    }
};

module.exports = {
    getAllProducts,
    getHatProduct
};
