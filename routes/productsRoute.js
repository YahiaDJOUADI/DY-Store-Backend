const express = require("express");
const multer = require("multer");
const productsController = require("../controllers/productsController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Set up multer for file uploads (default destination: 'public/uploads')
const upload = multer({ dest: "./public/uploads" });

// Define routes for products
router.get("/products", productsController.getProducts); // Get all products
router.post(
  "/products",
  authMiddleware, // Ensure only authenticated users can add products
  upload.single("image"), // Handle image upload
  productsController.addProduct // Add a new product
);
router.get("/products/:id", productsController.getProduct); // Get a single product by ID
router.put(
  "/products/:id",
  authMiddleware, // Ensure only authenticated users can update products
  upload.single("image"), // Handle image upload
  productsController.updateProduct // Update product details
);
router.delete(
  "/products/:id",
  authMiddleware, // Ensure only authenticated users can delete products
  productsController.deleteProduct // Delete a product
);

module.exports = router;
