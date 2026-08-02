const express = require("express");

const { userAuth } = require("../../middleware/userAuth");

const GetSkillRouter = express.Router();

/**
 * ======================================
 * Get Logged-In User Skills
 * GET /api/v1/users/me/skills
 * ======================================
 */
GetSkillRouter.get("/", userAuth, async (req, res) => {
  try {
    // ===============================
    // Authenticated User
    // ===============================
    const loggedInUser = req.user;

    // ===============================
    // Format Skills Response
    // ===============================
    const formattedSkills = loggedInUser.skills.map((skill) => ({
      _id: skill._id,
      skillName: skill.skillName,
      category: skill.category,
      type: skill.type,
      level: skill.level,
      experience: skill.experience,
      description: skill.description,
    }));

    // ===============================
    // Success Response
    // ===============================
    return res.status(200).json({
      success: true,
      message: "Skills fetched successfully.",
      count: formattedSkills.length,
      data: formattedSkills,
    });

  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch skills.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
});

module.exports = { GetSkillRouter };