const validator = require("validator");
const {SKILL_CATEGORIES, SKILL_LEVELS, SKILL_TYPES} = require("../constants/skillConstants")

const validateSkillData = (req) => {
  
  // ===============================
  // Sanitize Request Body
  // ===============================
  req.body.skillName = req.body.skillName?.trim();
  req.body.category = req.body.category?.trim();
  req.body.type = req.body.type?.trim();
  req.body.level = req.body.level?.trim();
  req.body.description = req.body.description?.trim();

  // ===============================
  // Extract Fields
  // ===============================
  const { skillName, category, type, level, experience, description } = req.body;

  // ===============================
  // Required Field Validation
  // ===============================
  if (!skillName) {
    throw new Error("Skill name is required.");
  }

  if (!category) {
    throw new Error("Skill category is required.");
  }

  if (!type) {
    throw new Error("Skill type is required.");
  }

  if (!level) {
    throw new Error("Skill level is required.");
  }

 // Allow 0 years of experience
  if (experience === undefined || experience === null) {
    throw new Error("Experience is required.");
  }

  // ===============================
  // Skill Name Validation
  // ===============================
  if (!validator.isLength(skillName, { min: 2, max: 50 })) {
    throw new Error("Skill name must be between 2 and 50 characters.");
  }

  // ===============================
  // Category Validation
  // ===============================
//   const allowedCategories = SKILL_CATEGORIES;

  if (!SKILL_CATEGORIES.includes(category)) {
    throw new Error("Invalid Skill Category.");
  }

  // ===============================
  // Type Validation
  // ===============================
  if (!SKILL_TYPES.includes(type)) {
    throw new Error("Skill type must be either 'Teach' or 'Learn'. ");
  }

  // ===============================
  // Level Validation
  // ===============================
  if (!SKILL_LEVELS.includes(level)) {
    throw new Error("Skill level must be Beginner, Intermediate or Advanced.");
  }

  // ===============================
  // Experience Validation
  // ===============================
  if (!Number.isInteger(experience) || experience < 0 || experience > 60) {
    throw new Error(
      "Experience must be a whole number between 0 and 60 years."
    );
  }

  // ===============================
  // Description Validation
  // ===============================
  if (description && !validator.isLength(description, { max: 300 })) {
    throw new Error("Description cannot exceed 300 characters.");
  }
};

module.exports = { validateSkillData };
