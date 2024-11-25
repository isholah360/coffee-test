// Import your existing RabbitMQ connection logic

const connectRabbitMQ = require("../../utils/rabbitmq");


const publishToQueue = async (queue, message) => {
  try {
    const { connection, channel } = await connectRabbitMQ(); 
    channel.assertQueue(queue, { durable: true }); 
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true }); 
    console.log(`Message sent to queue ${queue}:`, message);
    
    
    setTimeout(() => {
      connection.close();
    }, 500); 
  } catch (error) {
    console.error('Error publishing to RabbitMQ:', error); 
  }
};

module.exports = { publishToQueue };
