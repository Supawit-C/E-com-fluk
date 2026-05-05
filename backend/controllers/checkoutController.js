/**
 * Checkout Controller - จัดการคำสั่งซื้อและการชำระเงิน
 */

const processCheckout = async (req, res) => {
    try {
        const { cartItems, email, creditCard, shippingMethod } = req.body;
        let errors = {};

        // 1. ตรวจสอบ Cart Items
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            errors.cart = 'ตะกร้าสินค้าว่างเปล่า';
        }

        // 2. ตรวจสอบ Email ด้วย Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
        }

        // 3. ตรวจสอบบัตรเครดิต 16 หลัก
        const ccRegex = /^\d{16}$/;
        if (!creditCard || !ccRegex.test(creditCard.replace(/\s/g, ''))) {
            errors.creditCard = 'หมายเลขบัตรเครดิตต้องมี 16 หลัก';
        }

        // หากพบข้อผิดพลาดในการ Validation ให้ส่ง 400 กลับไปทันที
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                status: 'Fail',
                message: 'ข้อมูลไม่ถูกต้อง',
                errors: errors
            });
        }

        // 4. คำนวณยอดรวม (Server-side calculation เพื่อความปลอดภัย)
        let subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        let shippingCost = 0;
        if (shippingMethod === 'express') shippingCost = 10;
        else if (shippingMethod === 'nextday') shippingCost = 20;

        const total = subtotal + shippingCost;

        // จำลองการบันทึกข้อมูลลง Database
        // [Save Order Step]
        const saveOrderSuccess = true; // สมมติว่าสำเร็จ

        if (!saveOrderSuccess) {
            throw new Error('Database Error: ไม่สามารถบันทึกคำสั่งซื้อได้');
        }

        // ส่งผลลัพธ์กลับไป
        res.status(200).json({
            status: 'Success',
            message: 'คำสั่งซื้อของคุณได้รับการยืนยันแล้ว',
            orderId: 'ORD-' + Math.floor(Math.random() * 1000000),
            totalAmount: total
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
