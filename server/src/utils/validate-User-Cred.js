const validator = require("validator");

// Function to validate and sanitize user credentials
const validateUserCred = (req) => {

    // Sanitize request body
    req.body.firstName = req.body.firstName?.trim();
    req.body.lastName = req.body.lastName?.trim();
    req.body.emailId = req.body.emailId?.trim().toLowerCase();

    const { firstName, lastName, emailId, password } = req.body;

    // Validate user data
    if (!firstName || !lastName) {
        throw new Error("First Name and Last Name are required.");
    }

    if (!validator.isLength(firstName, { min: 4, max: 20 })) {
        throw new Error("First Name must be between 4 and 20 characters.");
    }

    if (!validator.isLength(lastName, { min: 4, max: 30 })) {
        throw new Error("Last Name must be between 4 and 30 characters.");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email Address.");
    }

    if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password.");
    }
};

module.exports = { validateUserCred };