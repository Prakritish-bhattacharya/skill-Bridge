const express = require("express");
const mongoose = require("mongoose");

const { UserModel } = require("../../models/User-Model"); // require user model for search user
const { userAuth } = require("../../middleware/userAuth"); // import Authentication middleware which servs only authenticate users

const publicProfileRouter = express.Router(); // route initialize for public profile

/**
 * ==========================================
 * GET /public/:userId
 * View another user's public profile
 * ==========================================
 */

publicProfileRouter.get("/public/:userId", userAuth, async (req, res) => {
  try {
    // extract user ID form req.params
    const { userId } = req.params;

    /**
     * ------------------------------------
     * Validate Mongo ObjectId
     * ------------------------------------
     */

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid User ID !!!");
    }

    /**
     * ---------------------------------------
     * Prevent Viewing your own public profile
     * ---------------------------------------
     */

    if (req.user._id.toString() === userId) {
      throw new Error("Use /profile/view to access your own profile.");
    }

    /**
     * ---------------------------------------
     * Find user
     * Only select PUBLIC fields
     * ---------------------------------------
     */

    const publicUser = await UserModel.findById(userId).select(
      "firstName lastName gender photoUrl",
    );

    /**
     * ---------------------------------------
     * User exists ?
     * ---------------------------------------
     */
    if (!publicUser) {
      throw new Error("User not found !!!");
    }

    /**
     * ---------------------------------------
     *  Future Security
     *  Skip blocked / suspended users
     * ---------------------------------------
     */

    // if (publicUser.status !== "active") {
    //   throw new Error("Profile is not Available !!!");
    // }
    
    // ------------------------------------------------------
    // Success
    // ------------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Public profile fetched successfully.",
      user: publicUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = { publicProfileRouter };
