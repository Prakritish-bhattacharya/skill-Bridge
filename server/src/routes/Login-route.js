const express = require("express");
const { RegisterUserModel } = require("../models/Register-user-Model");
const bcrypt = require("bcrypt");
const loginRoute = express.Router();

loginRoute.post("/login", async (req, res) => {
  try {
    // get user emailId and password from request body
    const { emailId, password } = req.body;

    // find user through  Email ID from DB
    const user = await RegisterUserModel.findOne({ emailId: emailId });
    // check---->if emailId exists then proceed next step
    if (!user) {
      throw new Error("Please complete your Registration !!!");
    }

    /*
     *---------- Now compare password with Hash Password--------
     * 1) take plain text password from req.body
     * 2) extract hash password from DB
     * 3) Compare Both password
     */
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.json({ message: "Login successfull ...", user });
    } else {
      throw new Error("Password is wrong!!!");
    }
  } catch (error) {
    res.status(400).send("User login denied !!!" + error.message);
  }
});

module.exports = { loginRoute };
