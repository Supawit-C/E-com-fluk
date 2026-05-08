const OrderRepository = require('../repositories/orderRepository');

/**
 * Order Service - Business Logic Layer
 */
class OrderService {
    static async createOrder(orderData) {
        const { cartItems, firstName, lastName, email, address, shippingMethod } = orderData;

        // 1. Business Logic: Calculation
        let subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        let shippingCost = 0;
        if (shippingMethod === 'express') shippingCost = 10;
        else if (shippingMethod === 'nextday') shippingCost = 20;

        const total = subtotal + shippingCost;
        const fullName = `${firstName} ${lastName}`;

        // 2. Data Persistence via Repository
        const orderId = await OrderRepository.createOrder(fullName, email, address, total);

        // 3. Save Line Items
        const itemPromises = cartItems.map(item => 
            OrderRepository.createOrderItem(orderId, item.id, item.quantity, item.price)
        );
        await Promise.all(itemPromises);

        return { orderId, total };
    }
}

module.exports = OrderService;
