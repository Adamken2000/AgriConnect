const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authController = require('../controllers/authController');
const produceController = require('../controllers/produceController');
const orderController = require('../controllers/orderController');

// Auth Routes
router.post('/auth/register', authController.registerUser);
router.post('/auth/login', authController.loginUser);
router.post('/auth/forgot-password', authController.forgotPassword);

// Produce Routes
router.get('/produce', produceController.getAllProduce);
router.post('/produce', produceController.createProduce);
router.put('/produce/:id', produceController.updateProduce);
router.delete('/produce/:id', produceController.deleteProduce);
router.patch('/produce/:id/approve', produceController.approveProduce);

// Order Routes
router.get('/orders', orderController.getAllOrders);
router.post('/orders', orderController.createOrder);
router.patch('/orders/:id/status', orderController.updateOrderStatus);

// Fetch the farmer count from the Node.js backend port 3000
router.get('/farmers/count', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT COUNT(*) AS count FROM users WHERE role = 'farmer'");
        res.json({ count: rows[0].count });
    } catch (err) {
        console.error('Database error fetching farmer count:', err);
        res.status(500).json({ error: 'Database error' });
    }
});
module.exports = router;