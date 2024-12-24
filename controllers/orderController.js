const Order = require("../models/Order");

// Create a new order
exports.addOrder = async (req, res) => {
  try {
    const { products, totalPrice, status, date } = req.body;

   

    const newOrder = new Order({
      products,

      date: Date.now(),

      status,
    });

    // Save the new command
    await newOrder.save();
    res.status(201).json(newCommand);
  } catch (error) {
    res.status(500).json({ error: "Failed to add Command" });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.send(orders);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Order" });
  }
}
