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

module.exports = {
    getAllProducts
};
