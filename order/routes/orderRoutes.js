

const express = require('express');
const { createOrder, getOrders } = require('../controller/orderController');
const authMiddleware = require('../../admin/middleware/authMiddleware');
const router = express.Router();

// Route for creating an order
router.post('/order', createOrder);

router.get('/order', getOrders);

router.get('/order/:id', getOrderById);

router.get('/order/all', authMiddleware, getAllOrders);

router.put('/order/:id', authMiddleware, updateOrderStatus);

module.exports = router;
