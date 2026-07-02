const express = require("express");
const { UserModel } = require("../../models/User-Model");
const bcrypt = require("bcrypt");
const {userAuth} = require("../../middleware/userAuth")
const loginRoute = express.Router();
const logoutRoute = express.Router();

loginRoute.post("/login", async (req, res) => {
  try {
    // Get user emailId and password from request body
    const { emailId, password } = req.body;

    // Find user by emailId
    const user = await UserModel.findOne({ emailId }).select(
      "firstName lastName gender credits password",
    );

    // Check if user exists
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    /*
     * Compare entered password with hashed password
     */
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }
    /**
     * Take the password property and assign it to _ (which we intentionally ignore),
     * and put the remaining properties into userResponse.
     * */
    const { password: _, ...userResponse } = user.toObject(); //

    // create JWT Token
    const token = await user.getJWT();
    // Add the token to cookie and send the response back to server
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Last login status
    user.lastLogin = new Date();
    await user.save(); // save last login date

    // Success response
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: userResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Login Failed !!!",
    });
  }
});

logoutRoute.post("/logout", userAuth, (req, res) => {
  try {

    const user = req.user
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: ` ${user.firstName} Logout successfully.`,
    });

  } catch (error) {
    console.log(error);

    return res.status(400).json({
      success: false,
      message: "Logout failed.",
    });
  }
});

module.exports = { loginRoute, logoutRoute };
