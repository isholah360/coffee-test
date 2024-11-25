const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Product = require('../models/product');
const User = require('../models/User');
const { publishToQueue } = require('../utils/rabbitMq');


async function createOrder(req, res) {
  const { userId, productId, quantity, totalAmount } = req.body;

  try {
    const order = new Order({
      userId,
      productId,
      quantity,
      totalAmount,
    });

    await order.save();

    if (!mongoose.Types.ObjectId.isValid(order.productId)) {
      console.error('Invalid productId:', order.productId);
      return res.status(400).json({ message: 'Invalid productId' });
    }

    const product = await Product.findById(order.productId);

    if (!product) {
      console.error('Product not found for productId:', order.productId);
      return res.status(404).json({ message: 'Product not found' });
    }

    const vendorId = product.vendorId;
    const vendor = await User.findById(vendorId);
    if (!vendor) {
      console.error('User not found for vendorId:', vendorId);
      return;
    }

    const user = await User.findById(order.userId);
    if (!user) {
      console.error('User not found for userId:', userId);
      return;
    }

    const orderData = {
      orderId: order._id,
      userEmail: user.email, 
      vendorEmail: vendor.email, 
      userId: user.username, 
      productId: order.productId,
      quantity: order.quantity,
      totalAmount: order.totalAmount,
    };

    const message = {
      event: 'NEW_ORDER',
      message: { type: 'NEW_ORDER', payload: orderData },
    };

    publishToQueue('orderQueue', message);
    publishToQueue('adminQueue', message);

    return res.status(201).json({
      message: 'Order placed successfully',
      order: order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Failed to create order' });
  }
}

// 2. Get orders for the logged-in user
async function getOrders(req, res) {
  const { userId } = req.body;

  try {
    const orders = await Order.find({ userId });
    if (!orders) {
      return res.status(404).json({ message: 'No orders found' });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    return res.status(500).json({ message: 'Failed to retrieve orders' });
  }
}

// 3. Get details of a specific order
async function getOrderById(req, res) {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error retrieving order:', error);
    return res.status(500).json({ message: 'Failed to retrieve order' });
  }
}


async function getAllOrders(req, res) {
  const { role } = req.user;  
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden, admin access required' });
  }

  try {
    const orders = await Order.find();
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error retrieving all orders:', error);
    return res.status(500).json({ message: 'Failed to retrieve all orders' });
  }
}


async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const { role } = req.user; 

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden, admin access required' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: 'Failed to update order status' });
  }
}

module.exports = { createOrder, getOrders, getOrderById, getAllOrders, updateOrderStatus };
