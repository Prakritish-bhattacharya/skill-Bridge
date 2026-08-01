const express = require("express");
const bcrypt = require("bcrypt");

const { UserModel } = require("../../models/User-Model");
const { userAuth } = require("../../middleware/userAuth");
const { validateLoginCred } = require("../../utils/Validate-Login-Cred");

const loginRoute = express.Router();
const logoutRoute = express.Router();

/**
 * ======================================
 * Login User
 * POST /api/v1/login
 * ======================================
 */
loginRoute.post("/login", async (req, res) => {
  try {
    // ======================================
    // Validate & Sanitize Request
    // ======================================
    validateLoginCred(req);

    const { emailId, password } = req.body;

    // ======================================
    // Find User
    // ======================================
    const user = await UserModel.findOne({ emailId }).select(
      "_id firstName lastName emailId gender photoUrl credits password lastLogin",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ======================================
    // Verify Password
    // ======================================
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    // ======================================
    // Generate JWT
    // ======================================
    const token = await user.getJWT();

    // ======================================
    // Set Authentication Cookie
    // ======================================
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ======================================
    // Update Last Login
    // ======================================
    user.lastLogin = new Date();
    await user.save();

    // ======================================
    // Success Response
    // ======================================
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        gender: user.gender,
        photoUrl: user.photoUrl,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
});

/**
 * ======================================
 * Logout User
 * POST /api/v1/logout
 * ======================================
 */
logoutRoute.post("/logout", userAuth, (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to logout.",
    });
  }
});

module.exports = { loginRoute, logoutRoute };
