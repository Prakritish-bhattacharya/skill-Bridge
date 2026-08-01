const mongoose = require("mongoose"); // Import the mongoose module to interact with MongoDB

// Connect to the MongoDB database using the provided connection string
const connectDB = async () => {
  await mongoose.connect(
    process.env.MONGODB_URI, {
    dbName: "skillBridge",
  });
};

// Export the connectDB function to be used in other parts of the application
module.exports = { connectDB };
