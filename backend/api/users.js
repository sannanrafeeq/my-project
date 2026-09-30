const mongoose = require("mongoose");

const MONGODB_URI =
  "mongodb+srv://sannanrafeeq839_db_user:YOUR_PASSWORD@cluster0.0nsqaux.mongodb.net/mydatabase?appName=Cluster0";

const userSchema = new mongoose.Schema({
  name: String,
  age: Number
});

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
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
        age: Number(age)
      });

      return res.status(201).json({
        message: "User created successfully",
        user: user
      });
    }

    return res.status(405).json({
      message: "Method not allowed"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};