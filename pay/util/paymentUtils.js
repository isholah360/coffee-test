
const processPayment = (order) => {
    console.log('Processing payment for order:', order);
    const paymentSuccessful = true; 
    return paymentSuccessful;
  };
  

  const sendPaymentSuccessResponse = (order) => {
    console.log('Payment successful for order:', order);
  };
  
  module.exports = { processPayment, sendPaymentSuccessResponse };
  