// /services/order-service/routes/orderRoutes.js

const express = require('express');
const { createOrder } = require('../controller/orderController');
const router = express.Router();

// Route for creating an order
router.post('/order', createOrder);

module.exports = router;
