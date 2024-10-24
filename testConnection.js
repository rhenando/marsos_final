const mongoose = require("mongoose");

// Replace this with your MongoDB URI from MongoDB Atlas
const MONGODB_URI =
  "mongodb+srv://rhenando:Banana123456789@cluster0.e0bxk0g.mongodb.net/marsos?retryWrites=true&w=majority&appName=Cluster0";

// Set options to increase the timeout if needed
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000, // 30 seconds connection timeout
  socketTimeoutMS: 45000, // 45 seconds socket timeout
};

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, options)
  .then(() => {
    console.log("Successfully connected to MongoDB");
    mongoose.connection.close(); // Close the connection after successful connection
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
