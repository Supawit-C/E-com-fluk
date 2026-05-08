const ProductRepository = require('../repositories/productRepository');

/**
 * Product Service - Business Logic Layer
 */
class ProductService {
    static async getAllProducts() {
        // Business logic could go here (e.g., filtering inactive products)
        return await ProductRepository.findAll();
    }

    static async getHatProduct() {
        return await ProductRepository.findByName('Cool Hat');
    }
}

module.exports = ProductService;
