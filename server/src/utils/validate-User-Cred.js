const { Error } = require("mongoose");
const validator = require("validator");
const NAME_REGEX = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
// Function to validate and sanitize user credentials
const validateUserCred = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  //==============================================================================
  // First Name validation
  //==============================================================================
  if (typeof firstName !== "string") {
    // prevent NoSQL injection
    throw new Error("Invalid First Name.");
  }

  req.body.firstName = req.body.firstName?.trim();
  const sanitizedFirstName = req.body.firstName;

  if (validator.isEmpty(sanitizedFirstName)) {
    throw new Error("First Name is required.");
  }

  if (!validator.isLength(sanitizedFirstName, { min: 4, max: 20 })) {
    throw new Error("First Name must be between 4 and 20 characters.");
  }

  if (!NAME_REGEX.test(sanitizedFirstName)) {
    throw new Error("First Name contains invalid characters.");
  }

  //=======================================================================
  // Last Name validation
  //=======================================================================
  if (typeof lastName !== "string") {
    throw new Error("Invalid Last Name.");
  }
  req.body.lastName = req.body.lastName?.trim();
  const sanitizedLastName = req.body.lastName;

  if (validator.isEmpty(sanitizedLastName)) {
    throw new Error("Last Name is required.");
  }

  if (!validator.isLength(sanitizedLastName, { min: 4, max: 30 })) {
    throw new Error("Last Name must be between 4 and 30 characters.");
  }

  if (!NAME_REGEX.test(sanitizedLastName)) {
    throw new Error("Last Name contains invalid characters.");
  }

  //======================================================
  // Email Validation
  //======================================================

  if (typeof emailId !== "string") {
    throw new Error("Invalid Email Address.");
  }

  req.body.emailId = emailId.trim().toLowerCase();

  const sanitizedEmail = req.body.emailId;

  if (validator.isEmpty(sanitizedEmail)) {
    throw new Error("Email Address is required.");
  }

  if (!validator.isLength(sanitizedEmail, { max: 254 })) {
    throw new Error("Email Address is too long.");
  }

  if (!validator.isEmail(sanitizedEmail)) {
    throw new Error("Invalid Email Address.");
  }

  //=========================================
  // Password Validation
  //=========================================

  if (typeof password !== "string") {
    throw new Error("Invalid Password.");
  }

  req.body.password = password.trim();

  const sanitizedPassword = req.body.password;

  if (validator.isEmpty(sanitizedPassword)) {
    throw new Error("Password is required.");
  }

  if (!validator.isLength(sanitizedPassword, { max: 128 })) {
    throw new Error("Password is too long.");
  }

  if (
    !validator.isStrongPassword(sanitizedPassword, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error(
      "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
    );
  }
};

module.exports = { validateUserCred };
