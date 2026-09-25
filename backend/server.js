const mongoose = require("mongoose");
const http = require("http");

// MongoDB Atlas connection
mongoose.connect(
  "mongodb+srv://sannanrafeeq839_db_user:sheikh1122@cluster0.0nsqaux.mongodb.net/mydatabase?appName=Cluster0"
)
.then(() => {
  console.log("MongoDB Atlas connected!");
})
.catch((error) => {
  console.log("MongoDB connection error:", error.message);
});


// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number
});


// User Model
const User = mongoose.model("User", userSchema);


// Server
const server = http.createServer(async (req, res) => {

    // JSON response
    res.setHeader("Content-Type", "application/json");

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");


    // OPTIONS request
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }


    // GET /
    if (req.method === "GET" && req.url === "/") {

        res.writeHead(200);

        res.end(JSON.stringify({
            message: "Backend is running"
        }));

        return;
    }


    // GET /api/users
    if (req.method === "GET" && req.url === "/api/users") {

        try {

            const users = await User.find();

            res.writeHead(200);

            res.end(JSON.stringify(users));

        } catch (error) {

            console.log("GET ERROR:", error);

            res.writeHead(500);

            res.end(JSON.stringify({
                message: "Error getting users",
                error: error.message
            }));
        }

        return;
    }


    // POST /api/users
    if (req.method === "POST" && req.url === "/api/users") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });


        req.on("end", async () => {

            try {

                const data = JSON.parse(body);

                console.log("User received:", data);


                // Create user
                const user = new User({
                    name: data.name,
                    age: data.age
                });


                // Save user to MongoDB
                const savedUser = await user.save();

                console.log("User saved in MongoDB:", savedUser);
                console.log("Database:", mongoose.connection.name);


                res.writeHead(201);

                res.end(JSON.stringify({
                    message: "User created successfully",
                    user: savedUser
                }));


            } catch (error) {

                console.log("POST ERROR:", error);

                res.writeHead(500);

                res.end(JSON.stringify({
                    message: "Error creating user",
                    error: error.message
                }));
            }

        });

        return;
    }


    // Route not found
    res.writeHead(404);

    res.end(JSON.stringify({
        message: "Route not found"
    }));

});


// Start server
server.listen(3000, () => {
    console.log("Backend running on port 3000");
});