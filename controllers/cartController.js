const Cart = require("../models/Cart");

// Fetch the user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("products.product"); // Populate product details
    res.json(cart || { products: [] }); // Return an empty cart if not found
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// Add or update a product in the cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid product or quantity" });
  }

  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, products: [] });

    const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);

    if (productIndex >= 0) {
      cart.products[productIndex].quantity += quantity; // Update quantity if product exists
    } else {
      cart.products.push({ product: productId, quantity }); // Add new product to cart
    }

    await cart.save();
    res.status(200).json(await cart.populate("products.product")); // Return updated cart with populated product details
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Failed to add product to cart" });
  }
};

// Remove a product from the cart
const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter((p) => p.product.toString() !== productId); // Remove product
    await cart.save();

    res.status(200).json(await cart.populate("products.product")); // Return updated cart
  } catch (err) {
    console.error("Error removing product from cart:", err);
    res.status(500).json({ message: "Failed to remove product from cart" });
  }
};

// Update the quantity of a specific product in the cart
// Update the quantity of a specific product in the cart
const updateCartItemQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  // Validate input
  if (!productId || quantity === undefined || quantity < 0) {
    return res.status(400).json({ message: "Invalid product or quantity" });
  }

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Find the product in the cart
    const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);

    if (productIndex >= 0) {
      if (quantity === 0) {
        // Remove the product if the new quantity is 0
        cart.products.splice(productIndex, 1);
      } else {
        // Update the product's quantity
        cart.products[productIndex].quantity = quantity;
      }
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Save the updated cart
    await cart.save();

    // Populate and return the updated cart
    res.status(200).json(await cart.populate("products.product"));
  } catch (err) {
    console.error("Error updating cart item quantity:", err);
    res.status(500).json({ message: "Failed to update cart item quantity" });
  }
};


// Clear all products from the cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = []; // Clear the products array
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
};
