const mongoose = require("mongoose");

const Order = mongoose.model("Order", {
  products: [],
  status: String,
  date: Date,
});

module.exports = Order;
