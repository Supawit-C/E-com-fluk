const OrderRepository = require('../repositories/orderRepository');

const ProductRepository = require('../repositories/productRepository');

/**
 * Order Service - Business Logic Layer
 */
class OrderService {
    static async createOrder(orderData) {
        const { cartItems, firstName, lastName, email, address, shippingMethod } = orderData;

        // 1. Business Logic: Secure Price Calculation
        let subtotal = 0;
        const secureCartItems = [];

        // Fetch real prices from database, NEVER trust client prices
        for (const item of cartItems) {
            const product = await ProductRepository.findById(item.id);
            if (!product) throw new Error(`ไม่พบสินค้าในระบบ (ID: ${item.id})`);
            
            subtotal += product.price * item.quantity;
            
            // Build a new array with the trusted database price
            secureCartItems.push({
                id: item.id,
                quantity: item.quantity,
                price: product.price
            });
        }

        let shippingCost = 0;
        if (shippingMethod === 'express') shippingCost = 10;
        else if (shippingMethod === 'nextday') shippingCost = 20;

        const total = subtotal + shippingCost;
        const fullName = `${firstName} ${lastName}`;

        // 2. Data Persistence with Database Transaction
        const orderId = await OrderRepository.createOrderWithItems(fullName, email, address, total, secureCartItems);

        return { orderId, total };
    }
}

module.exports = OrderService;
