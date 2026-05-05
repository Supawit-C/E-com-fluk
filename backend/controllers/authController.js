const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Path to users data
const usersFilePath = path.join(__dirname, '../data/users.json');
const authUserFilePath = path.join(__dirname, '../data/auth_user.json');

/**
 * Security Note:
 * As a Security Engineer, I recommend using a generic error message like 
 * "Invalid email or password" for both missing emails and incorrect passwords 
 * to prevent user enumeration. However, following the specific logic requested:
 */

/**
 * Auth Controller - จัดการระบบยืนยันตัวตน
 * 1. ตรวจสอบบัญชีผู้ใช้จากไฟล์ users.json
 * 2. เปรียบเทียบรหัสผ่านที่เข้ารหัสด้วย bcrypt
 * 3. สร้าง JSON Web Token (JWT) เพื่อใช้ในการยืนยันตัวตนในระบบอื่นๆ
 */

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ขั้นตอนที่ 1: ตรวจสอบความครบถ้วนของข้อมูล
        if (!email || !password) {
            return res.status(400).json({ message: 'กรุณากรอกอีเมลและรหัสผ่าน' });
        }

        // ขั้นตอนที่ 2: ค้นหาผู้ใช้จากฐานข้อมูล (รวมทั้ง users.json และ auth_user.json)
        let usersData = [];
        if (fs.existsSync(usersFilePath)) {
            usersData = usersData.concat(JSON.parse(fs.readFileSync(usersFilePath, 'utf-8')));
        }
        if (fs.existsSync(authUserFilePath)) {
            usersData = usersData.concat(JSON.parse(fs.readFileSync(authUserFilePath, 'utf-8')));
        }

        const user = usersData.find(u => u.username === email);

        // ขั้นตอนที่ 3: ตรวจสอบว่ามีอีเมลนี้หรือไม่
        if (!user) {
            // หมายเหตุด้านความปลอดภัย: การแยกแยะว่าไม่พบอีเมลอาจถูกนำไปใช้เดารายชื่อผู้ใช้ได้ (User Enumeration)
            return res.status(401).json({ message: 'ไม่พบอีเมลนี้ในระบบ' });
        }

        // ขั้นตอนที่ 4: ตรวจสอบรหัสผ่านโดยใช้ bcrypt เปรียบเทียบกับ Hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
        }

        // ขั้นตอนที่ 5: สร้าง JWT Token หากข้อมูลถูกต้อง
        // SECRET_KEY ควรถูกเก็บไว้ในไฟล์ .env ในสภาพแวดล้อมจริง
        const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key';
        
        const token = jwt.sign(
            { id: user.id || user.username, email: user.username },
            JWT_SECRET,
            { expiresIn: '1h' } // Token มีอายุ 1 ชั่วโมง
        );

        // ขั้นตอนที่ 6: ส่ง Token กลับไปยัง Client
        return res.status(200).json({
            message: 'เข้าสู่ระบบสำเร็จ',
            token
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

        let usersData = [];
        try {
            if (fs.existsSync(authUserFilePath)) {
                usersData = JSON.parse(fs.readFileSync(authUserFilePath, 'utf-8'));
            } else {
                fs.writeFileSync(authUserFilePath, JSON.stringify([]));
            }
        } catch (e) {
            console.error('Error reading auth_user.json:', e);
        }

        // ตรวจสอบอีเมลซ้ำในทั้งสองไฟล์
        let allUsers = [...usersData];
        if (fs.existsSync(usersFilePath)) {
            const defaultUsers = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
            allUsers = allUsers.concat(defaultUsers);
        }

        const userExists = allUsers.find(u => u.username === email);
        if (userExists) {
            return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = {
            id: Date.now().toString(),
            name,
            username: email,
            password_hash
        };

        usersData.push(newUser);
        fs.writeFileSync(authUserFilePath, JSON.stringify(usersData, null, 2));

        return res.status(201).json({ message: 'ลงทะเบียนสำเร็จ' });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในระบบ' });
    }
};

module.exports = {
    login,
    register
};
