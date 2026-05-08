const AuthService = require('../services/authService');

/**
 * Auth Controller - Presentation Layer
 * Only handles Request and Response
 */

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'กรุณากรอกอีเมลและรหัสผ่าน' });

        const token = await AuthService.login(email, password);
        return res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ', token });
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });

        await AuthService.register(name, email, password);
        return res.status(201).json({ message: 'ลงทะเบียนสำเร็จ' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { login, register };
