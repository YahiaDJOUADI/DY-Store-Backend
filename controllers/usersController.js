const User = require("../models/User");
const jwt = require("jsonwebtoken");

// get all the users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// get one user by ID
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch User" });
  }
};

// Add a new User
exports.addUser = async (req, res) => {
  try {
    const { userName, email, phone, password,birthdate, gender } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Create a new user with default 'user' type
    const newUser = new User({
      userName,
      email,
      phone,
      password,  // No password hashing here
      birthdate,
      gender,
      type: 'user',  // Default type is set to 'user'
    });

    // Save the user to the database
    await newUser.save();

    // Hardcoded JWT secret key (do not use in production, prefer environment variables)
    const JWT_SECRET = "fheuifheiuhinvqpngatfvegfd";  // Define your secret key here

    // Generate JWT token without expiration time
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET);

    // Send the response with the user and the token
    res.status(201).json({
      token,
      user: {
        userName: newUser.userName,
        email: newUser.email,
        phone: newUser.phone,
        birthdate: newUser.birthdate,
        gender: newUser.gender,
        type: newUser.type,  // The default 'user' type
      },
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
}

// Delete a User by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete User" });
  }
};

// Update a User by ID
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from request params
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      req.body, 
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      // Hardcoded JWT secret key for login
      const JWT_SECRET = "fheuifheiuhinvqpngatfvegfd";  // Define your secret key here

      // Generate JWT token without expiration time
      const token = jwt.sign({ id: user._id }, JWT_SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
// Add this to your User controller

// Get the authenticated user's details based on the JWT token



exports.myAccount = async (req, res) => {
  try {
    // The token should be sent in the Authorization header in the format: Bearer <token>
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, "fheuifheiuhinvqpngatfvegfd"); // Use a proper secret key here (move to env vars)

    // If token is invalid, return an error
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Find the user by the decoded ID from the token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user details including the ID
    res.status(200).json({
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        phone: user.phone,
        birthdate: user.birthdate,
        gender: user.gender,
        type: user.type,  // 'admin' or 'user'
      },
    });
  } catch (error) {
    console.error("Error fetching user account:", error);
    res.status(500).json({ error: "Failed to fetch user account" });
  }
};
// Example of promoting a user to admin
// Promote a user to admin


exports.promoteToAdmin = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // This will be the new user type

  // Check if the logged-in user is authorized (email should be 'yahia@gmail.com')
  if (req.user.email !== "yahia@gmail.com") {
    return res.status(403).json({ message: "Not authorized to promote users" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's type (admin or user)
    user.type = type;
    await user.save();

    return res.status(200).json({ message: "User type updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update user type" });
  }
};
