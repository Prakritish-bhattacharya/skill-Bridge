const express = require("express");
const { userAuth } = require("../../middleware/userAuth");
const { ExchangeRequestModel } = require("../../models/ExchangeRequest-Model");
const IncomingExchangeRequestRouter = express.Router();
/**
 * ======================================
 * Get Incoming Exchange Requests
 * GET /api/v1/exchange-requests/incoming
 * ======================================
 */
IncomingExchangeRequestRouter.get("/incoming", userAuth, async (req, res) => {
  try {
    // ===============================
    // Logged-In User
    // ===============================
    const authenticatedUser = req.user;

    //================================
    // Fetch Incoming Exchange Request
    //================================
    const incomingRequests = await ExchangeRequestModel.find({
      receiver: authenticatedUser._id,
    })
      .populate("sender", "firstName lastName photoUrl skills") // populate() tells mongoose---go to the users collection, find the user, and replace the ObjectId with selected Fields
      .sort({ createdAt: -1 });

    const formattedRequests = incomingRequests.map((request) => {
      const offeredSkill = request.sender.skills.id(request.offeredSkill);

      return {
        _id: request._id,

        sender: {
          _id: request.sender._id,
          firstName: request.sender.firstName,
          lastName: request.sender.lastName,
          photoUrl: request.sender.photoUrl,
        },

        offeredSkill: offeredSkill
          ? {
              _id: offeredSkill._id,
              skillName: offeredSkill.skillName,
              category: offeredSkill.category,
              type: offeredSkill.type,
              level: offeredSkill.level,
              experience: offeredSkill.experience,
              description: offeredSkill.description,
            }
          : null,

        requestedSkillName: request.requestedSkillName,
        message: request.message,
        status: request.status,
        createdAt: request.createdAt,
      };
    });

    // ===============================
    // Success Response
    // ===============================
    return res.status(200).json({
      success: true,
      count: incomingRequests.length,
      data: formattedRequests,
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

module.exports = { IncomingExchangeRequestRouter };
