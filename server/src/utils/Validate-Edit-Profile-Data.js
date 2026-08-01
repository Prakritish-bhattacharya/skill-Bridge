const validator = require("validator");

const NAME_REGEX = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

const validateEditProfileData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "gender", "photoUrl"];

  const updateFields = Object.keys(req.body);

  //=====================================
  // Empty Request
  //=====================================
  if (updateFields.length === 0) {
    throw new Error("Nothing to update.");
  }

  //=====================================
  // Allow Only Editable Fields
  //=====================================
  const isEditAllowed = updateFields.every((field) =>
    allowedEditFields.includes(field),
  );

  if (!isEditAllowed) {
    throw new Error("Invalid Edit Request.");
  }

  //=====================================
  // First Name
  //=====================================
  if ("firstName" in req.body) {
    if (typeof req.body.firstName !== "string") {
      throw new Error("Invalid First Name.");
    }

    req.body.firstName = req.body.firstName.trim();

    const sanitizedFirstName = req.body.firstName;

    if (validator.isEmpty(sanitizedFirstName)) {
      throw new Error("First Name is required.");
    }

    if (
      !validator.isLength(sanitizedFirstName, {
        min: 4,
        max: 20,
      })
    ) {
      throw new Error("First Name must be between 4 and 20 characters.");
    }

    if (!NAME_REGEX.test(sanitizedFirstName)) {
      throw new Error("First Name contains invalid characters.");
    }
  }

  //=====================================
  // Last Name
  //=====================================
  if ("lastName" in req.body) {
    if (typeof req.body.lastName !== "string") {
      throw new Error("Invalid Last Name.");
    }

    req.body.lastName = req.body.lastName.trim();

    const sanitizedLastName = req.body.lastName;

    if (validator.isEmpty(sanitizedLastName)) {
      throw new Error("Last Name is required.");
    }

    if (
      !validator.isLength(sanitizedLastName, {
        min: 4,
        max: 20,
      })
    ) {
      throw new Error("Last Name must be between 4 and 20 characters.");
    }

    if (!NAME_REGEX.test(sanitizedLastName)) {
      throw new Error("Last Name contains invalid characters.");
    }
  }

  //=====================================
  // Gender
  //=====================================
  if ("gender" in req.body) {
    if (typeof req.body.gender !== "string") {
      throw new Error("Invalid Gender.");
    }

    req.body.gender = req.body.gender.trim().toLowerCase();

    if (validator.isEmpty(req.body.gender)) {
      throw new Error("Gender is required.");
    }

    if (!["male", "female", "other"].includes(req.body.gender)) {
      throw new Error("Invalid Gender.");
    }
  }

  //=====================================
  // Photo URL
  //=====================================
  if ("photoUrl" in req.body) {
    if (typeof req.body.photoUrl !== "string") {
      throw new Error("Photo URL must be a string.");
    }

    req.body.photoUrl = req.body.photoUrl.trim();

    if (validator.isEmpty(req.body.photoUrl)) {
      throw new Error("Photo URL is required.");
    }

    if (!validator.isURL(req.body.photoUrl)) {
      throw new Error("Invalid Photo URL.");
    }
  }

  return true;
};

module.exports = { validateEditProfileData };
