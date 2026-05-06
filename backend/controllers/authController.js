const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/database');

/**
 * Auth Controller - จัดการระบบยืนยันตัวตนผ่าน SQLite
 */

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'กรุณากรอกอีเมลและรหัสผ่าน' });
        }

        // ค้นหาผู้ใช้จาก SQLite
        db.get('SELECT * FROM users WHERE username = ?', [email], async (err, user) => {
            if (err) {
                console.error('Login DB Error:', err);
                return res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในระบบ' });
            }

            if (!user) {
                return res.status(401).json({ message: 'ไม่พบอีเมลนี้ในระบบ' });
            }

            // ตรวจสอบรหัสผ่าน
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
            }

            const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key';
            const token = jwt.sign(
                { id: user.id, email: user.username },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                message: 'เข้าสู่ระบบสำเร็จ',
                token
            });
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในระบบ' });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // บันทึกลง SQLite โดยใช้ db.run() แทน fs.writeFile()
        const sql = `INSERT INTO users (name, username, password_hash) VALUES (?, ?, ?)`;
        const params = [name, email, password_hash];

        db.run(sql, params, function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
                }
                console.error('Register DB Error:', err);
                return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
            }

            return res.status(201).json({ message: 'ลงทะเบียนสำเร็จ' });
        });

    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในระบบ' });
    }
};

module.exports = {
    login,
    register
};
