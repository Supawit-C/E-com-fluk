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

/**
 * Controller สำหรับจัดการ Logic ของ "Hat Scenario"
 * Processing: Server เปิดซองจดหมาย (Envelope), ตรวจสอบ Gatekeeper และดึงข้อมูล
 */
const getHat = (req, res) => {
    try {
        // [GATEKEEPER] Logic: ตรวจสอบว่าใน "ซองจดหมาย" (Request Headers) มีกุญแจที่ถูกต้องหรือไม่
        const token = req.headers['x-envelope-token'];
        
        if (token !== 'secret-key') {
            // [RESPONSE] หากกุญแจไม่ถูกต้อง ส่ง Status "Fail" กลับไป
            return res.status(403).json({ 
                status: 'Fail', 
                message: 'Gatekeeper denied access: Invalid envelope token.' 
            });
        }

        // [FETCH DATA] หากกุญแจถูกต้อง ไปดึงข้อมูลหมวกจาก Service
        const hat = productService.getHatProduct();
        
        // [RESPONSE] ส่ง "Package" (JSON) และ Status "Success" กลับไปให้ Browser
        res.status(200).json({
            status: 'Success',
            package: hat
        });
    } catch (error) {
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
