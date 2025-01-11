const express = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");


const router = express.Router();

// Define routes for orders
router.get("/orders", authMiddleware, orderController.getOrders); 
router.post("/orders", authMiddleware, orderController.createOrder);

module.exports = router;