const validator = require("validator");

const validateEditProfileData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "gender"];

  const updateFields = Object.keys(req.body);

  // Empty request body
  if (updateFields.length === 0) {
    throw new Error("Nothing to update.");
  }

  // Check allowed fields
  const isEditAllowed = updateFields.every((field) =>
    allowedEditFields.includes(field)
  );

  if (!isEditAllowed) {
    throw new Error("Invalid Edit Request !!!");
  }

  // -------- firstName --------
  if ("firstName" in req.body) {
    if (typeof req.body.firstName !== "string") {
      throw new Error("First Name must be a string.");
    }

    req.body.firstName = req.body.firstName.trim();

    if (!validator.isLength(req.body.firstName, { min: 4, max: 20 })) {
      throw new Error("First Name must be between 4 and 20 characters.");
    }
  }

  // -------- lastName --------
  if ("lastName" in req.body) {
    if (typeof req.body.lastName !== "string") {
      throw new Error("Last Name must be a string.");
    }

    req.body.lastName = req.body.lastName.trim();

    if (!validator.isLength(req.body.lastName, { min: 4, max: 30 })) {
      throw new Error("Last Name must be between 4 and 30 characters.");
    }
  }

  // -------- gender --------
  if ("gender" in req.body) {
    if (!["male", "female", "other"].includes(req.body.gender)) {
      throw new Error("Invalid Gender.");
    }
  }

  return true;
};

module.exports = { validateEditProfileData };