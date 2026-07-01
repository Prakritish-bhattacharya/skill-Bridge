const express = require("express"); // Import the express module to create an Express application
const { connectDB } = require("./config/database"); // Import the connectDB function from the database configuration file to establish a connection to the MongoDB database
const app = express(); // Create an instance of the Express application

app.get("/login", (req, res) => {
  res.send("Login Page"); // Define a route for the "/login" endpoint that sends a response "Login Page"
});

// connect to the mongoDB database using the connectDB function
connectDB().then(() => {
  console.log("Database connected successfully...");
  // start the server
  app.listen(7777, () => {
    console.log("Server started at port number 7777"); // Start the server and listen on port 7777, logging a message to the console when the server starts
  });
}).catch((error)=>{
    console.log("Error connecting Database!!!", error)
})
