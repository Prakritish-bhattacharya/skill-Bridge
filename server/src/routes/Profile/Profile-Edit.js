const express = require("express");
const { userAuth } = require("../../middleware/userAuth");
const {
  validateEditProfileData,
} = require("../../utils/Validate-Edit-Profile-Data");

const editProfileRouter = express.Router();

editProfileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // Validate & sanitize request
    validateEditProfileData(req);

    const loggedInUser = req.user;

    // Update fields
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    // Save updated document
    await loggedInUser.save();

    const { firstName, lastName, gender, photoUrl } = loggedInUser;

    return res.status(200).json({
      success: true,
      message: `${firstName}'s profile updated successfully.`,
      user: {
        firstName,
        lastName,
        gender,
        photoUrl
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = { editProfileRouter };