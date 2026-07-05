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
    // Logged In User
    // ===============================
    const loggedInUser = req.user;

    // ===============================
    // Duplicate skill check
    // ===============================
    const normalizedSkillName = req.body.skillName.trim().toLowerCase();

    const skillExists = loggedInUser.skills.some(
      // some() ---> stops immediately after finding the first match in worst case T.C -> 0(n)
      (skill) => skill.skillName.trim() === normalizedSkillName,
    );

    if (skillExists) {
      return res.status(409).json({
        success: false,
        message: "Skill already exists.",
      });
    }

    // ==============================
    // Create New Skill Object
    // (Whitelist only)
    // ===============================

    const newSkill = {
      skillName: normalizedSkillName,
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
    console.log(loggedInUser.skills)

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
      skill: addedSkill,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = { AddSkillRouter };
