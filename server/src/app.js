const express = require("express"); // Import the express module to create an Express application
const { connectDB } = require("./config/database"); // Import the connectDB function from the database configuration file to establish a connection to the MongoDB database
const cookieparser = require("cookie-parser")
const app = express(); // Create an instance of the Express application
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieparser())
// import Routes from routes folder
const { registerRoute } = require("./routes/Authentication/Register-route");
const {loginRoute, logoutRoute} = require("./routes/Authentication/Login-route")
const {profileRouter} = require("./routes/Profile/Profile-View")

// asign Routers
app.use("/", registerRoute); // Use the registerRoute for handling requests to the root path ("/")
app.use("/", loginRoute) 
app.use("/", logoutRoute)
app.use("/", profileRouter)

// connect to the mongoDB database using the connectDB function
connectDB()
  .then(() => {
    console.log("Database connected successfully...");
    // start the server
    app.listen(7777, () => {
      console.log("Server started at port number 7777"); // Start the server and listen on port 7777, logging a message to the console when the server starts
    });
  })
  .catch((error) => {
    console.log("Error connecting Database!!!", error);
  });
