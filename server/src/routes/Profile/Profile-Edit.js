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
    // ===============================
    // Logged In User
    // ===============================
    const loggedInUser = req.user;

    // ===============================
    // Update Allowed Fields
    // ===============================
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    // ===============================
    // Save Updated Profile
    // ===============================
    await loggedInUser.save();

    const { _id, firstName, lastName, gender, photoUrl } = loggedInUser;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        _id,
        firstName,
        lastName,
        gender,
        photoUrl,
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
      message: "Failed to update profile.",
    });
  }
});

module.exports = { editProfileRouter };
