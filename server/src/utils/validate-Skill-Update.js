const validator = require("validator");
const {
  SKILL_CATEGORIES,
  SKILL_TYPES,
  SKILL_LEVELS,
} = require("../constants/skillConstants");
const validateSkillUpdate = (req) => {
  // =======================
  // Allowed Update Fields
  // =======================
  const allowedUpdates = [
    "category",
    "type",
    "level",
    "experience",
    "description",
  ];
  const updates = Object.keys(req.body);

  // =======================
  // Empty Body Validation
  // =======================
  if (updates.length === 0) {
    throw new Error("Please provide at least one field to update.");
  }

  // =======================
  // Whitelist Validation
  // =======================
  const isValidUpdate = updates.every((field) =>
  allowedUpdates.includes(field),
);

if (!isValidUpdate) {
  throw new Error("Invalid update field.");
}

  // =======================
  // Category Validation
  // =======================
  if ("category" in req.body) {
    // Type Validation
    if (typeof req.body.category !== "string") {
      throw new Error("Invalid Skill Category.");
    }

    // Sanitize
    req.body.category = req.body.category.trim();

    const sanitizedCategory = req.body.category;

    // Empty Validation
    if (validator.isEmpty(sanitizedCategory)) {
      throw new Error("Skill Category is required.");
    }

    // Enum Validation
    if (!SKILL_CATEGORIES.includes(sanitizedCategory)) {
      throw new Error("Invalid Skill Category.");
    }
  }

  // =======================
  // Type Validation
  // =======================
  if ("type" in req.body) {
    // Type Validation
    if (typeof req.body.type !== "string") {
      throw new Error("Invalid Skill Type.");
    }

    // Sanitize
    req.body.type = req.body.type.trim();

    const sanitizedType = req.body.type;

    // Empty Validation
    if (validator.isEmpty(sanitizedType)) {
      throw new Error("Skill Type is required.");
    }

    // Enum Validation
    if (!SKILL_TYPES.includes(sanitizedType)) {
      throw new Error("Skill Type must be either 'Teach' or 'Learn'.");
    }
  }

  // =======================
  // Level Validation
  // =======================
  if ("level" in req.body) {
    // Type Validation
    if (typeof req.body.level !== "string") {
      throw new Error("Invalid Skill Level.");
    }

    // Sanitize
    req.body.level = req.body.level.trim();

    const sanitizedLevel = req.body.level;

    // Empty Validation
    if (validator.isEmpty(sanitizedLevel)) {
      throw new Error("Skill Level is required.");
    }

    // Enum Validation
    if (!SKILL_LEVELS.includes(sanitizedLevel)) {
      throw new Error(
        "Skill Level must be Beginner, Intermediate or Advanced.",
      );
    }
  }

  // =======================
  // Experience Validation
  // =======================
  if ("experience" in req.body) {
    // Type Validation
    if (typeof req.body.experience !== "number") {
      throw new Error("Experience must be a number.");
    }

    // Integer Validation
    if (!Number.isInteger(req.body.experience)) {
      throw new Error("Experience must be a whole number.");
    }

    // Range Validation
    if (req.body.experience < 0 || req.body.experience > 60) {
      throw new Error("Experience must be between 0 and 60 years.");
    }
  }

  // =======================
  // Description Validation
  // =======================
  if ("description" in req.body) {
    // Type Validation
    if (typeof req.body.description !== "string") {
      throw new Error("Description must be a string.");
    }

    // Sanitize
    req.body.description = req.body.description.trim();

    const sanitizedDescription = req.body.description;

    // Maximum Length
    if (!validator.isLength(sanitizedDescription, { max: 300 })) {
      throw new Error("Description cannot exceed 300 characters.");
    }

    // Prevent HTML / XSS
    if (/<[^>]*>/.test(sanitizedDescription)) {
      throw new Error("Description contains invalid content.");
    }
  }
};
module.exports = { validateSkillUpdate };