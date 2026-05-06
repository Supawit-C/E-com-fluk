const db = require('../config/database');

const processCheckout = async (req, res) => {
    try {
        const { cartItems, firstName, lastName, email, address, creditCard, shippingMethod } = req.body;
        let errors = {};

        // 1. Validation
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            errors.cart = 'ตะกร้าสินค้าว่างเปล่า';
        }
        if (!firstName || !lastName) {
            errors.name = 'กรุณากรอกชื่อและนามสกุล';
        }
        if (!address) {
            errors.address = 'กรุณากรอกที่อยู่สำหรับการจัดส่ง';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
        }

        const ccRegex = /^\d{16}$/;
        if (!creditCard || !ccRegex.test(creditCard.replace(/\s/g, ''))) {
            errors.creditCard = 'หมายเลขบัตรเครดิตต้องมี 16 หลัก';
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                status: 'Fail',
                message: 'ข้อมูลไม่ถูกต้อง',
                errors: errors
            });
        }

        // 2. Calculations
        let subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        let shippingCost = 0;
        if (shippingMethod === 'express') shippingCost = 10;
        else if (shippingMethod === 'nextday') shippingCost = 20;

        const total = subtotal + shippingCost;

        // 3. Save to Database (Orders Header)
        const orderSql = `INSERT INTO orders (name, email, address, total_price) VALUES (?, ?, ?, ?)`;
        const fullName = `${firstName} ${lastName}`;
        const orderParams = [fullName, email, address, total];

        db.run(orderSql, orderParams, function(err) {
            if (err) {
                console.error('Database Error (Orders):', err);
                return res.status(500).json({
                    status: 'Fail',
                    message: 'ไม่สามารถบันทึกข้อมูลคำสั่งซื้อได้'
                });
            }

            const orderId = this.lastID;

            // 4. Save Order Items (Line Items)
            const itemSql = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
            
            const itemPromises = cartItems.map(item => {
                return new Promise((resolve, reject) => {
                    db.run(itemSql, [orderId, item.id, item.quantity, item.price], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            });

            Promise.all(itemPromises)
                .then(() => {
                    res.status(200).json({
                        status: 'Success',
                        message: 'คำสั่งซื้อของคุณได้รับการยืนยันแล้ว',
                        orderId: orderId,
                        totalAmount: total
                    });
                })
                .catch(itemError => {
                    console.error('Database Error (Items):', itemError);
                    res.status(500).json({
                        status: 'Fail',
                        message: 'เกิดข้อผิดพลาดในการบันทึกรายการสินค้า'
                    });
                });
        });

    } catch (error) {
        console.error('Checkout Error:', error);
        res.status(400).json({
            status: 'Fail',
            message: 'เกิดข้อผิดพลาดในการประมวลผลคำสั่งซื้อ',
            systemError: error.message
        });
    }
};

module.exports = {
    processCheckout
};
