const express = require("express");
const mongoose = require("mongoose");

const { UserModel } = require("../../models/User-Model");
const { userAuth } = require("../../middleware/userAuth");

const publicProfileRouter = express.Router();

/**
 * ==========================================
 * GET /public/:userId
 * View Another User's Public Profile
 * ==========================================
 */

publicProfileRouter.get("/public/:userId", userAuth, async (req, res) => {
  try {
    // =====================================
    // Extract User ID
    // =====================================
    const { userId } = req.params;

    // =====================================
    // Validate Mongo ObjectId
    // =====================================
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID.",
      });
    }

    // =====================================
    // Prevent Viewing Own Public Profile
    // =====================================
    if (req.user._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Use /profile/view to access your own profile.",
      });
    }

    // =====================================
    // Find User
    // Only Select Public Fields
    // =====================================
    const publicUser = await UserModel.findById(userId).select(
      "firstName lastName gender photoUrl skills"
    );

    // =====================================
    // User Exists?
    // =====================================
    if (!publicUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // =====================================
    // Future Security
    // Skip Suspended / Blocked Users
    // =====================================
    /*
    if (publicUser.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Profile is not available.",
      });
    }
    */

    // =====================================
    // Format Skills
    // =====================================
    const formattedSkills = publicUser.skills.map((skill) => ({
      _id: skill._id,
      skillName: skill.skillName,
      category: skill.category,
      type: skill.type,
      level: skill.level,
      experience: skill.experience,
      description: skill.description,
    }));

    // =====================================
    // Success Response
    // =====================================
    return res.status(200).json({
      success: true,
      message: "Public profile fetched successfully.",
      data: {
        _id: publicUser._id,
        firstName: publicUser.firstName,
        lastName: publicUser.lastName,
        gender: publicUser.gender,
        photoUrl: publicUser.photoUrl,
        skills: formattedSkills,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch public profile.",
    });
  }
});

module.exports = { publicProfileRouter };
