const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * Route definition for Products
 * GET /api/products
 */
router.get('/', productController.getProducts);
router.get('/hat', productController.getHat);

module.exports = router;
