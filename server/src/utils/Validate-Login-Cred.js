const validator = require("validator");

/**
 * ======================================
 * Validate & Sanitize Login Credentials
 * ======================================
 */
const validateLoginCred = (req) => {
  const { emailId, password } = req.body;

  // ======================================
  // Email Validation
  // ======================================

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

  // ======================================
  // Password Validation
  // ======================================

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

  return true;
};

module.exports = { validateLoginCred };
