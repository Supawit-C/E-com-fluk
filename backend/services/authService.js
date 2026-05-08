const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/userRepository');

/**
 * Auth Service - Business Logic Layer
 */
class AuthService {
    static async login(email, password) {
        const user = await UserRepository.findByUsername(email);
        if (!user) throw new Error('ไม่พบอีเมลนี้ในระบบ');

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) throw new Error('รหัสผ่านไม่ถูกต้อง');

        const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key';
        return jwt.sign(
            { id: user.id, email: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
    }

    static async register(name, email, password) {
        const userExists = await UserRepository.findByUsername(email);
        if (userExists) throw new Error('อีเมลนี้ถูกใช้งานแล้ว');

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        return await UserRepository.create(name, email, passwordHash);
    }
}

module.exports = AuthService;
