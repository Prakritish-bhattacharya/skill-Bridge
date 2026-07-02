const express = require("express");
const { userAuth } = require("../../middleware/userAuth");
const profileRouter = express.Router();

//profile view route
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    //  Select which user fields to expose in the API response
    const { firstName, lastName, gender, credits } = req.user;

    return res.status(200).json({
      success: true,
      message: `${firstName}'s profile`,
      user: {
        firstName,
        lastName,
        gender,
        credits,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = { profileRouter };
