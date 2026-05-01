const productService = require('../services/productService');

/**
 * Controller to handle Request and Response logic
 */
const getProducts = (req, res) => {
    try {
        const products = productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

module.exports = {
    getProducts
};
