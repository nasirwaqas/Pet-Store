import Order from '../models/orderModel.js';

export const placeOrder = async (req, res) => {
  const { deliveryInfo, paymentMethod, cartItems } = req.body;

  if (!deliveryInfo || !paymentMethod || !cartItems) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newOrder = new Order({
      userId: req.user._id, // Assuming user ID is available in req.user
      deliveryInfo,
      paymentMethod,
      cartItems,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};