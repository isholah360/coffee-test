const Product = require('../models/product');
const rabbitmq = require('../utils/rabbitmq');



// create a new product
const createPro = async (req, res) => {
  const { title, description, price, stock, category, thumbnail,  } = req.body;
  const vendorId = req.user.id;//  // Assumes `req.user` contains the authenticated user's data
  console.log(vendorId)

  try {
    const newProduct = new Product({ title, description, price, stock, vendorId, category, thumbnail });
    await newProduct.save();

    // Publish to RabbitMQ for event handling (product creation)
    rabbitmq.publishToQueue('product_created', JSON.stringify(newProduct));

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

module.exports = {createPro}