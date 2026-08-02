const express = require("express");
const mongoose = require("mongoose");
const { userAuth } = require("../../middleware/userAuth");
const { validateSkillUpdate } = require("../../utils/validate-Skill-Update");

const UpdateSkillRouter = express.Router();

/**
 * ======================================
 * Update User Skill
 * PATCH /api/v1/users/me/skills/:skillId
 * ======================================
 */
UpdateSkillRouter.patch("/:skillId", userAuth, async (req, res) => {
  try {
    //=======================
    // Authenticated User
    //=======================
    const loggedInUser = req.user;

    //======================
    // Extract SkillId
    //======================
    const { skillId } = req.params;
    // check if skillId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Skill Id.",
      });
    }

    validateSkillUpdate(req);

    //========================
    // Search Mongoose SubDocument Array using Mongoose helper
    // Find Skill by id
    //========================
    const skill = loggedInUser.skills.id(skillId);

    //========================
    // Skill existsss ?????????
    //========================
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found !!!",
      });
    }

    //============================================
    // Main Business Rule===========>>>>
    // Learn ---> Teach  (valid)
    // Teach ---> Learn  (Prohibited)
    //============================================
    if (req.body.type) {
      if (skill.type === "Teach" && req.body.type === "Learn") {
        return res.status(400).json({
          success: false,
          message: "Teaching skills cannot be changed back to learning skills.",
        });
      }
    }

    //====================================
    // LOOP through request body
    //====================================
    Object.keys(req.body).forEach((field) => {
      skill[field] = req.body[field];
    });

    //======================
    // save the user
    //=====================
    await loggedInUser.save();

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully.",
      data: {
        _id: skill._id,
        category: skill.category,
        type: skill.type,
        level: skill.level,
        experience: skill.experience,
        description: skill.description,
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

module.exports = { UpdateSkillRouter };
