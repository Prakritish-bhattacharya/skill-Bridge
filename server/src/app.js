const express = require("express"); // Import the express module to create an Express application
const { connectDB } = require("./config/database"); // Import the connectDB function from the database configuration file to establish a connection to the MongoDB database
const cookieparser = require("cookie-parser");
const app = express(); // Create an instance of the Express application
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieparser());
// import Routes from routes folder
const { registerRoute } = require("./routes/Authentication/Register-route");
const {
  loginRoute,
  logoutRoute,
} = require("./routes/Authentication/Login-route");
const { profileRouter } = require("./routes/Profile/Profile-View");
const { editProfileRouter } = require("./routes/Profile/Profile-Edit");
const { publicProfileRouter } = require("./routes/Profile/Public-Profile");
const { AddSkillRouter } = require("./routes/Skill/Add-Skill");
const { GetSkillRouter } = require("../src/routes/Skill/Get-Skill");
const { UpdateSkillRouter } = require("./routes/Skill/Update-Skill");
const { DeleteSkillRouter } = require("../src/routes/Skill/Delete-Skill");
const { CreateExchangeRequestRouter } = require("./routes/ExchangeRequest/Create-Exchange-Request");
const { IncomingExchangeRequestRouter } = require("./routes/ExchangeRequest/Incoming-Exchange-Request");
const { OutgoingExchangeRequestRouter } = require("./routes/ExchangeRequest/Outgoing-Exchange-Request");


// asign Routers
app.use("/", registerRoute); // Use the registerRoute for handling requests to the root path ("/")
app.use("/", loginRoute);
app.use("/", logoutRoute);
app.use("/", profileRouter);
app.use("/", editProfileRouter);
app.use("/", publicProfileRouter);
app.use("/api/v1/users/me/skills", AddSkillRouter);
app.use("/api/v1/users/me/skills", GetSkillRouter);
app.use("/api/v1/users/me/skills", UpdateSkillRouter);
app.use("/api/v1/users/me/skills", DeleteSkillRouter);
app.use("/api/v1/exchange-requests", CreateExchangeRequestRouter);
app.use("/api/v1/exchange-requests", IncomingExchangeRequestRouter);
app.use("/api/v1/exchange-requests", OutgoingExchangeRequestRouter);

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
