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

        // Remove sensitive fields
        const user = savedUser.toObject(); // Convert Mongoose document to plain object
        delete user.password; // Remove password field
        // why removing __v field? It's a version key added by Mongoose to track document revisions. It's not needed in the response, so we remove it for cleaner output.
        delete user.__v; 

        // Success response
        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user,
        });

    } catch (error) {

        // Duplicate email
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Unable to register user. Please recheck your credentials.",
            });
        }

        // Validation & other errors
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = { registerRoute };