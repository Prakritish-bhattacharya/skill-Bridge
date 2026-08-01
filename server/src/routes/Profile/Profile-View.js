const express = require("express");
const { userAuth } = require("../../middleware/userAuth");
const profileRouter = express.Router();

//profile view route
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    //  Select which user fields to expose in the API response
    const {
      _id,
      firstName,
      lastName,
      emailId,
      gender,
      photoUrl,
      credits,
      skills,
    } = req.user;
    const formattedSkills = skills.map((skill) => ({
      _id: skill._id,
      skillName: skill.skillName,
      category: skill.category,
      type: skill.type,
      level: skill.level,
      experience: skill.experience,
      description: skill.description,
    }));

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: {
        _id,
        firstName,
        lastName,
        emailId,
        gender,
        photoUrl,
        credits,
        skills: formattedSkills,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Fetch Profile.",
    });
  }
});

module.exports = { profileRouter };
