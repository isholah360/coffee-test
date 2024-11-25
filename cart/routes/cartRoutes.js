const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const protect = require('../../user/middleware/protect');


router.get('/cart', protect, cartController.getCart);


router.post('/cart/add', protect, cartController.addToCart);


router.post('/cart/remove', protect, cartController.removeFromCart);


router.post('/cart/checkout', protect, cartController.checkout);

module.exports = router;
