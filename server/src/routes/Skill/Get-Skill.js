const express = require("express");

const { userAuth } = require("../../middleware/userAuth");
const { validateSkillData } = require("../../utils/validate-Skill-Data");

const GetSkillRouter = express.Router();

/**
 * ======================================
 * Get Logged In User Skills
 * GET /api/v1/users/me/skills
 * ======================================
 */
GetSkillRouter.get("/", userAuth, async (req, res) => {
  try {
    // ===============================
    // Logged In User
    // ===============================
    const loggedInUser = req.user;

    // ===============================
    // Extract Skills
    // ===============================
    const skills = loggedInUser.skills;

    // ===============================
    // Sanitize Response
    // ===============================
    const sanitizedSkills = skills.map((skill) => ({
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
      count: sanitizedSkills.length,
      skills: sanitizedSkills,
    });

  } catch (error) {
    console.log(error)

    return res.status(500).json({
        success:false,
        message:"Unable to fetch Skills."
    })
  }
});



module.exports = {GetSkillRouter}