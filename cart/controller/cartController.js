const Cart = require('../models/cartModel');
const Order = require('../../order/models/orderModel');  


async function getCart(req, res) {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error retrieving cart:', error);
    return res.status(500).json({ 
      message: 'Failed to retrieve cart',
      error: error.message 
    });
  }
}


async function addToCart(req, res) {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
     
      await Cart.create({
        userId,
        products: [{ productId, quantity }]
      });
    } else {
      
      const existingProductIndex = cart.products.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingProductIndex >= 0) {
       
        cart.products[existingProductIndex].quantity += quantity;
      } else {
     
        cart.products.push({ productId, quantity });
      }

      await cart.save();
    }

    return res.status(200).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Cart error:', error);
    return res.status(500).json({ 
      message: 'Failed to add product to cart',
      error: error.message 
    });
  }
}


async function removeFromCart(req, res) {
  const { productId } = req.body;
  userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
    if (productIndex >= 0) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      return res.status(200).json({ message: 'Product removed from cart', cart });
    } else {
      return res.status(404).json({ message: 'Product not in cart' });
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    return res.status(500).json({ message: 'Failed to remove product from cart' });
  }
}


async function checkout(req, res) {
  userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate('products.productId');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }


    const order = new Order({
      userId,
      products: cart.products,
      totalPrice: cart.products.reduce((total, item) => total + item.productId.price * item.quantity, 0),
      status: 'Pending',
    });

    await order.save();
    
  
    cart.products = [];
    await cart.save();

    return res.status(200).json({ message: 'Checkout successful', order });
  } catch (error) {
    console.error('Error during checkout:', error);
    return res.status(500).json({ message: 'Failed to process checkout' });
  }
}

module.exports = { getCart, addToCart, removeFromCart, checkout };
