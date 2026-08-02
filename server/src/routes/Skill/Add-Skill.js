const express = require("express");

const { userAuth } = require("../../middleware/userAuth");
const { validateSkillData } = require("../../utils/validate-Skill-Data");

const AddSkillRouter = express.Router();

/**
 * ======================================
 * Add a new skill
 * POST /api/v1/users/me/skills
 * ======================================
 */
AddSkillRouter.post("/", userAuth, async (req, res) => {
  try {
    // ===============================
    // Validate Request Body
    // ===============================
    validateSkillData(req);

    // ===============================
    // Authenticated User
    // ===============================
    const loggedInUser = req.user;

    // ===============================
    // Normalize Skill Name
    // ===============================
    const sanitizedSkillName = req.body.skillName;
    const normalizedSkillName = sanitizedSkillName.toLowerCase();
    req.body.skillName = normalizedSkillName;

    // ===============================
    // Duplicate Skill Check
    // ===============================
    const skillExists = loggedInUser.skills.some(
      (skill) => skill.skillName.toLowerCase() === normalizedSkillName,
    );

    if (skillExists) {
      return res.status(409).json({
        success: false,
        message: "Skill already exists.",
      });
    }

    // ===============================
    // Create New Skill Object
    // ===============================
    const newSkill = {
      skillName: req.body.skillName,
      category: req.body.category,
      type: req.body.type,
      level: req.body.level,
      experience: req.body.experience,
      description: req.body.description || "",
    };

    // ===============================
    // Add Skill
    // ===============================
    loggedInUser.skills.push(newSkill);

    // ===============================
    // Save User
    // ===============================
    await loggedInUser.save();

    // ===============================
    // Get Newly Added Skill
    // ===============================
    const addedSkill = loggedInUser.skills[loggedInUser.skills.length - 1];

    // ===============================
    // Success Response
    // ===============================
    return res.status(201).json({
      success: true,
      message: "Skill added successfully.",
      data: {
        _id: addedSkill._id,
        skillName: addedSkill.skillName,
        category: addedSkill.category,
        type: addedSkill.type,
        level: addedSkill.level,
        experience: addedSkill.experience,
        description: addedSkill.description,
      },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
});

module.exports = { AddSkillRouter };
