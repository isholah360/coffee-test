const Order = require('../../order/models/orderModel');
const Payment = require('../model/paymentModel'); 
const { processPayment, sendPaymentSuccessResponse } = require('../util/paymentUtils');

const processOrderPayment = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paymentSuccessful = processPayment(order);

   
    const paymentRecord = new Payment({
      orderId: order._id,
      amount: order.totalAmount,
      paymentMethod: order.paymentMethod, 
      status: paymentSuccessful ? 'completed' : 'failed',
      transactionId: paymentSuccessful ? generateTransactionId() : null, 
      paymentDate: new Date(),
    });


    await paymentRecord.save();

    order.paymentStatus = paymentRecord.status;
    order.paymentId = paymentRecord._id; 
    await order.save();

    if (paymentSuccessful) {
      sendPaymentSuccessResponse(order);
      return res.status(200).json({ message: 'Payment successful', order });
    } else {
      return res.status(500).json({ message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ message: 'Payment processing failed' });
  }
};

module.exports = { processOrderPayment };
