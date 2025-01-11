const express = require("express");
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Define routes for cart
router.get("/cart", authMiddleware, cartController.getCart); 
router.post("/cart/add",  authMiddleware,cartController.addToCart); 
router.post("/cart/remove",authMiddleware, cartController.removeFromCart); 
router.post("/cart/update", authMiddleware, cartController.updateCartItemQuantity); 
router.delete("/cart",authMiddleware,  cartController.clearCart);

module.exports = router;