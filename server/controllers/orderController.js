const db = require('../config/db');

exports.createOrder = async (req, res) => {
    try {
        const { id, buyer_id, recipient_name, delivery_address, items, subtotal, shipping_fee, total, payment_method } = req.body;
        
        await db.execute(
            `INSERT INTO orders (id, buyer_id, recipient_name, delivery_address, subtotal, shipping_fee, total, payment_method, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Placed')`,
            [id, buyer_id, recipient_name, delivery_address, subtotal, shipping_fee, total, payment_method]
        );

        for (const item of items) {
            await db.execute(
                `INSERT INTO order_items (order_id, produce_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
                [id, item.produce_id, item.quantity, item.unit_price]
            );
        }

        res.status(201).json({ message: 'Order created successfully', order_id: id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.execute('SELECT * FROM orders ORDER BY created_at DESC');
        
        // Fetch and attach items for each order
        for (let order of orders) {
            const [items] = await db.execute(`
                SELECT oi.*, p.title, p.unit 
                FROM order_items oi 
                JOIN produce p ON oi.produce_id = p.id 
                WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
        }

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.status(200).json({ message: 'Order status updated successfully', order_id: id, status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};