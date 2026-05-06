const productService = require('../services/productService');

/**
 * Controller สำหรับดึงรายการสินค้าทั้งหมด
 */
const getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('getProducts Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

/**
 * Controller สำหรับดึงข้อมูลหมวก (Hat Scenario)
 */
const getHat = async (req, res) => {
    try {
        const token = req.headers['x-envelope-token'];
        
        if (token !== 'secret-key') {
            return res.status(403).json({ 
                status: 'Fail', 
                message: 'Gatekeeper denied access: Invalid envelope token.' 
            });
        }

        const hat = await productService.getHatProduct();
        
        if (!hat) {
            return res.status(404).json({
                status: 'Fail',
                message: 'Product not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            package: hat
        });
    } catch (error) {
        console.error('getHat Error:', error);
        res.status(500).json({ 
            status: 'Fail', 
            message: error.message 
        });
    }
};

module.exports = {
    getProducts,
    getHat
};
