const express = require("express");
const { userAuth } = require("../../middleware/userAuth");
const { ExchangeRequestModel } = require("../../models/ExchangeRequest-Model");

const OutgoingExchangeRequestRouter = express.Router();

/**
 * ======================================
 * Get Outgoing Exchange Requests
 * GET /api/v1/exchange-requests/outgoing
 * ======================================
 */
OutgoingExchangeRequestRouter.get("/outgoing", userAuth, async (req, res) => {
  try {
    // ===============================
    // Logged-In User
    // ===============================
    const loggedInUser = req.user;

    // ===============================
    // Fetch Outgoing Exchange Request
    // ===============================
    const outgoingRequests = await ExchangeRequestModel.find({
      sender: loggedInUser._id,
    })
      .populate("receiver", "firstName lastName photoUrl skills")
      .sort({ createdAt: -1 });

    const formattedRequests = outgoingRequests.map((request) => {
      const requestedSkill = request.receiver.skills.id(request.requestedSkill);

      return {
        _id: request._id,

        receiver: {
          _id: request.receiver._id,
          firstName: request.receiver.firstName,
          lastName: request.receiver.lastName,
          photoUrl: request.receiver.photoUrl,
        },

        requestedSkill: {
          skillName: requestedSkill.skillName,
          category: requestedSkill.category,
          type: requestedSkill.type,
          level: requestedSkill.level,
          experience: requestedSkill.experience,
          description: requestedSkill.description,
        },

        offeredSkillName: request.offeredSkillName,
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
      count: formattedRequests.length,
      requests: formattedRequests,
    });

    return res.status(200).json({
      success: true,
      message: "Outgoing Exchange Request route reached successfully...",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = { OutgoingExchangeRequestRouter };
