const express = require('express');
const router = express.Router();
const { processOrderPayment } = require('../controller/paymentController');


router.post('/process-payment/:orderId', processOrderPayment);

module.exports = router;
