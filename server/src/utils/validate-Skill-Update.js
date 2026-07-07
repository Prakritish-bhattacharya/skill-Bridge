const validator = require("validator");

const {
  SKILL_CATEGORIES,
  SKILL_TYPES,
  SKILL_LEVELS,
} = require("../constants/skillConstants");

const validateSkillUpdate = (req) => {
  // =======================
  // Sanitize Request Body
  // =======================
  if (req.body.category) {
    req.body.category = req.body.category.trim();
  }

  if (req.body.type) {
    req.body.type = req.body.type.trim();
  }

  if (req.body.level) {
    req.body.level = req.body.level.trim();
  }

  if (req.body.description) {
    req.body.description = req.body.description.trim();
  }

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
  const isValidOperation = updates.every((field) =>
    allowedUpdates.includes(field),
  );

  if (!isValidOperation) {
    throw new Error("Invalid update field.");
  }

  // =======================
  // Category Validation
  // =======================
  if (req.body.category && !SKILL_CATEGORIES.includes(req.body.category)) {
    throw new Error("Invalid skill category.");
  }

  // =======================
  // Type Validation
  // =======================
  if (req.body.type && !SKILL_TYPES.includes(req.body.type)) {
    throw new Error("Skill type must be either 'Teach' or 'Learn'.");
  }

  // =======================
  // Level Validation
  // =======================
  if (req.body.level && !SKILL_LEVELS.includes(req.body.level)) {
    throw new Error("Skill level must be Beginner, Intermediate or Advanced.");
  }

  // =======================
  // Experience Validation
  // =======================
  if (req.body.experience !== undefined) {
    if (
      !Number.isInteger(req.body.experience) ||
      req.body.experience < 0 ||
      req.body.experience > 60
    ) {
      throw new Error(
        "Experience must be a whole number between 0 and 60 years.",
      );
    }
  }

  // =======================
  // Description Validation
  // =======================
  if (
    req.body.description !== undefined &&
    !validator.isLength(req.body.description, { max: 300 })
  ) {
    throw new Error("Description cannot exceed 300 characters.");
  }
};

module.exports = { validateSkillUpdate };
