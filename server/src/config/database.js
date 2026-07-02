const mongoose = require("mongoose"); // Import the mongoose module to interact with MongoDB

// Connect to the MongoDB database using the provided connection string
const connectDB = async () => {
  await mongoose.connect(
    "mongodb://namastedev:lEXZ1NnPNoiYchPP@ac-y9kizj9-shard-00-00.6y1z85y.mongodb.net:27017,ac-y9kizj9-shard-00-01.6y1z85y.mongodb.net:27017,ac-y9kizj9-shard-00-02.6y1z85y.mongodb.net:27017/?ssl=true&replicaSet=atlas-ir0nom-shard-0&authSource=admin&appName=NamasteNode",{
      dbName: "skillBridge"
    }
  );
};

// Export the connectDB function to be used in other parts of the application
module.exports = { connectDB };
