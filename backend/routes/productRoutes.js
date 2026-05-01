const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * Route definition for Products
 * GET /api/products
 */
router.get('/', productController.getProducts);

module.exports = router;
