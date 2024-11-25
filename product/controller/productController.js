const Product = require('../models/product');
const rabbitmq = require('../utils/rabbitmq');



exports.createProduct = async (req, res) => {
  const {title, description, price, stock, category, thumbnail } = req.body;
  const adminId = req.user.id; 
  try {
    const newProduct = new Product({title, description, price, adminId, stock, category, thumbnail });
    await newProduct.save();

   
    rabbitmq.publishToQueue('product_created', JSON.stringify(newProduct));

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};



exports.editProduct = async (req, res) => {
  const productId = req.params.id;
  const {title, description, price, stock, category, thumbnail } = req.body;

  try {
    const product = await Product.findById(productId);

 
    if (product.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this product' });
    }

    product.title =title || product.title;
    product.category =category || product.category;
    product.thumbnail =thumbnail || product.thumbnail;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.updatedAt = Date.now();

    await product.save();

 
    rabbitmq.publishToQueue('product_updated', JSON.stringify(product));

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

   
    if (product.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this product' });
    }

    await product.remove();

  
    rabbitmq.publishToQueue('product_deleted', JSON.stringify(product));

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};


