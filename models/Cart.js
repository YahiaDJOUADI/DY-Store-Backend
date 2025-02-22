const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  },
  products: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product" 
      },
      quantity: { 
        type: Number, 
        default: 1 
      },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);