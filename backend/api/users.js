const mongoose = require("mongoose");

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI;

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

// User model
const User =
  mongoose.models.User || mongoose.model("User", userSchema);

// MongoDB connection
async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
}

// API
module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  // OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    // Connect MongoDB
    await connectDB();

    // GET users
    if (req.method === "GET") {
      const users = await User.find();

      return res.status(200).json(users);
    }

    // POST user
    if (req.method === "POST") {
      const { name, age } = req.body;

      const user = await User.create({
        name: name,
        age: Number(age),
      });

      return res.status(201).json({
        message: "User created successfully",
        user: user,
      });
    }

    // Other methods
    return res.status(405).json({
      message: "Method not allowed",
    });

  } catch (error) {
    console.log("ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};