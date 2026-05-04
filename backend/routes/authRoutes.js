const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * กำหนด Endpoint สำหรับระบบ Authentication
 * - POST /api/auth/login: สำหรับตรวจสอบสิทธิ์และรับ Token
 */
router.post('/login', authController.login);

module.exports = router;
