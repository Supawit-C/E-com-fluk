const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * กำหนด Endpoint สำหรับระบบ Authentication
 * - POST /api/auth/login: สำหรับตรวจสอบสิทธิ์และรับ Token
 * - POST /api/auth/register: สำหรับลงทะเบียนผู้ใช้งานใหม่
 */
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
