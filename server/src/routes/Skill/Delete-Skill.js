const express = require("express");
const mongoose = require("mongoose");

const { userAuth } = require("../../middleware/userAuth");

const DeleteSkillRouter = express.Router();

/**
 * ======================================
 * Delete User Skill
 * DELETE /api/v1/users/me/skills/:skillId
 * ======================================
 */
DeleteSkillRouter.delete("/:skillId", userAuth, async (req, res) => {
  try {
    // ===============================
    // Authenticated User
    // ===============================
    const loggedInUser = req.user;

    // ===============================
    // Extract Skill Id
    // ===============================
    const { skillId } = req.params;

    // ===============================
    // Validate Skill Id
    // ===============================
    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Skill Id.",
      });
    }

    // ===============================
    // Find Skill by Id
    // ===============================
    const skill = loggedInUser.skills.id(skillId);

    // ===============================
    // Skill Exists?
    // ===============================
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    // ===============================
    // Preserve Deleted Skill
    // ===============================
    const deletedSkill = skill.toObject();

    // ===============================
    // Delete Skill
    // ===============================
    skill.deleteOne();

    // ===============================
    // Persist Changes
    // ===============================
    await loggedInUser.save();

    // ===============================
    // Success Response
    // ===============================
    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully.",
      data: {
        _id: deletedSkill._id,
        skillName: deletedSkill.skillName,
        category: deletedSkill.category,
        type: deletedSkill.type,
        level: deletedSkill.level,
        experience: deletedSkill.experience,
        description: deletedSkill.description,
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

module.exports = { DeleteSkillRouter };
