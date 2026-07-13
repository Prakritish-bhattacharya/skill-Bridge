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
    const loggedInUser = req.user;

    //================================
    // Fetch Incoming Exchange Request
    //================================
    const incomingRequests = await ExchangeRequestModel.find({
      receiver: loggedInUser._id,
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

        offeredSkill: {
          skillName: offeredSkill.skillName,
          category: offeredSkill.category,
          type: offeredSkill.type,
          level: offeredSkill.level,
          experience: offeredSkill.experience,
          description: offeredSkill.description,
        },

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
      // requests: incomingRequests,
      requests: formattedRequests,
    });

    return res.status(200).json({
      success: true,
      message: "Route reached Successfullt...",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = { IncomingExchangeRequestRouter };
