const Order = require("../models/Order");

// Create a new order
const createOrder = async (req, res) => {
  const { shippingAddress, products, totalPrice, name, phone } = req.body;

  try {
    // Validate required fields
    if (!shippingAddress || !products || !totalPrice || !name || !phone) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Create the order
    const order = new Order({
      user: req.user._id, // Only authenticated users can create orders
      products,
      totalPrice,
      shippingAddress,
      name,
      phone,
    });

    await order.save(); // Save the order
    res.status(201).json({ message: "Order created successfully!", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order." });
  }
};

// Get all orders for the authenticated user
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }); // Fetch orders for the user
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

module.exports = { createOrder, getOrders };