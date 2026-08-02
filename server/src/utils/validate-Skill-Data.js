const validator = require("validator");
const SKILL_NAME_REGEX = /^[A-Za-z0-9#+.\- ]+$/;
const {
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  SKILL_TYPES,
} = require("../constants/skillConstants");

const validateSkillData = (req) => {
  // ===============================
  // Extract Fields
  // ===============================
  const { skillName, category, type, level, experience, description } =
    req.body;

  // ===============================
  // Skill Name Validation
  // ===============================
  if (typeof skillName !== "string") {
    throw new Error("Invalid Skill Name.");
  }

  // Sanitize
  req.body.skillName = skillName.trim();

  const sanitizedSkillName = req.body.skillName;

  // Required
  if (validator.isEmpty(sanitizedSkillName)) {
    throw new Error("Skill Name is required.");
  }

  // Length
  if (!validator.isLength(sanitizedSkillName, { min: 2, max: 50 })) {
    throw new Error("Skill Name must be between 2 and 50 characters.");
  }

  if (!SKILL_NAME_REGEX.test(sanitizedSkillName)) {
    throw new Error("Skill Name contains invalid characters.");
  }

  // ======================================
  // Category Validation
  // ======================================

  if (typeof category !== "string") {
    throw new Error("Invalid Skill Category.");
  }

  // Sanitize
  req.body.category = category.trim();

  const sanitizedCategory = req.body.category;

  // Required
  if (validator.isEmpty(sanitizedCategory)) {
    throw new Error("Skill Category is required.");
  }

  // Enum Validation
  if (!SKILL_CATEGORIES.includes(sanitizedCategory)) {
    throw new Error("Invalid Skill Category.");
  }

  // ======================================
  // Type Validation
  // ======================================

  if (typeof type !== "string") {
    throw new Error("Invalid Skill Type.");
  }

  // Sanitize
  req.body.type = type.trim();

  const sanitizedType = req.body.type;

  // Required
  if (validator.isEmpty(sanitizedType)) {
    throw new Error("Skill Type is required.");
  }

  // Enum Validation
  if (!SKILL_TYPES.includes(sanitizedType)) {
    throw new Error("Skill Type must be either 'Teach' or 'Learn'.");
  }

  // ======================================
  // Level Validation
  // ======================================

  if (typeof level !== "string") {
    throw new Error("Invalid Skill Level.");
  }

  // Sanitize
  req.body.level = level.trim();

  const sanitizedLevel = req.body.level;

  // Required
  if (validator.isEmpty(sanitizedLevel)) {
    throw new Error("Skill Level is required.");
  }

  // Enum Validation
  if (!SKILL_LEVELS.includes(sanitizedLevel)) {
    throw new Error("Skill Level must be Beginner, Intermediate or Advanced.");
  }

  // ======================================
  // Experience Validation
  // ======================================

  // Required
  if (experience === undefined || experience === null) {
    throw new Error("Experience is required.");
  }

  // Type Validation
  if (typeof experience !== "number") {
    throw new Error("Experience must be a number.");
  }

  // Integer Validation
  if (!Number.isInteger(experience)) {
    throw new Error("Experience must be a whole number.");
  }

  // Range Validation
  if (experience < 0 || experience > 60) {
    throw new Error("Experience must be between 0 and 60 years.");
  }

  // ======================================
  // Description Validation
  // ======================================

  if ("description" in req.body) {
    // Type Validation
    if (typeof description !== "string") {
      throw new Error("Description must be a string.");
    }

    // Sanitize
    req.body.description = description.trim();

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

module.exports = { validateSkillData };
