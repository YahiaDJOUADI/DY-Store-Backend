const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, "fheuifheiuhinvqpngatfvegfd"); // Replace with your actual secret key

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Attach the user to the request object
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach the user to the request for later use
    req.user = user;

    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = authMiddleware;
