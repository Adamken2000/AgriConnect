const express = require('express');
const router = express.Router();
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

module.exports = router;