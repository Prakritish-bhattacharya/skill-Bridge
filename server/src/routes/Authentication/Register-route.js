const express = require("express");
const bcrypt = require("bcrypt");

const { UserModel } = require("../../models/User-Model");
const { validateUserCred } = require("../../utils/validate-User-Cred");

const registerRoute = express.Router();

const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt hashing

// Define a route for user registration
registerRoute.post("/register", async (req, res) => {
  try {
    // Validate & sanitize user credentials
    validateUserCred(req);

    // Extract sanitized data
    const { firstName, lastName, emailId, password, gender } = req.body;

    // Encrypt password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const newUser = new UserModel({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
    });

    // Save user
    const savedUser = await newUser.save();

    // Success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        emailId: savedUser.emailId,
        gender: savedUser.gender,
        photoUrl: savedUser.photoUrl,
      },
    });
  } catch (error) {
    console.error(error);

    // Duplicate email
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists. Please use a different email.",
      });
    }

    // Validation error
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // unexpected error
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during registration.",
    });
  }
});

module.exports = { registerRoute };
