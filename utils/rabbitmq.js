const amqp = require('amqplib');

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost'); // Connect to RabbitMQ
    const channel = await connection.createChannel(); // Create a channel
    console.log('RabbitMQ connected successfully');
    return { connection, channel }; // Return the connection and channel
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error); // Log the error for debugging
    throw new Error('RabbitMQ connection failed'); // Throw error to be caught elsewhere
  }
};

module.exports = connectRabbitMQ;