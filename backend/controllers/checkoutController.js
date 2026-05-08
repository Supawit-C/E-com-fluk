const OrderService = require('../services/orderService');

/**
 * Checkout Controller - Presentation Layer
 */
const processCheckout = async (req, res) => {
    try {
        const { cartItems, firstName, lastName, email, address, creditCard, shippingMethod } = req.body;
        
        // Validation (Still in controller as it's request-related)
        let errors = {};
        if (!cartItems?.length) errors.cart = 'ตะกร้าสินค้าว่างเปล่า';
        if (!firstName || !lastName) errors.name = 'กรุณากรอกชื่อและนามสกุล';
        if (!address) errors.address = 'กรุณากรอกที่อยู่';
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ status: 'Fail', message: 'ข้อมูลไม่ถูกต้อง', errors });
        }

        // Call Service for Business Logic and DB Persistence
        const result = await OrderService.createOrder(req.body);

        res.status(200).json({
            status: 'Success',
            message: 'คำสั่งซื้อของคุณได้รับการยืนยันแล้ว',
            orderId: result.orderId,
            totalAmount: result.total
        });

    } catch (error) {
        console.error('Checkout Error:', error);
        res.status(500).json({ status: 'Fail', message: error.message });
    }
};

module.exports = { processCheckout };
