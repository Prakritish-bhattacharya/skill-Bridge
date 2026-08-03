const express = require("express");
const mongoose = require("mongoose");
const { userAuth } = require("../../middleware/userAuth");
const { ExchangeRequestModel } = require("../../models/ExchangeRequest-Model");

const CompleteExchangeRequestRouter = express.Router();
/**
 * ======================================
 * Complete Exchange Request
 * PATCH /api/v1/exchange-requests/:requestId/complete
 * ======================================
 */
CompleteExchangeRequestRouter.patch(
  "/:requestId/complete",
  userAuth,
  async (req, res) => {
    try {
      // ===============================
      // Business Rule #1
      // Extract Request Id
      // ===============================
      const { requestId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid request id.",
        });
      }
      // ===============================
      // Business Rule #2
      // Fetch Exchange Request
      // ===============================
      const exchangeRequest = await ExchangeRequestModel.findById(requestId);
      if (!exchangeRequest) {
        return res.status(404).json({
          success: false,
          message: "Exchange request not found.",
        });
      }

      //================================
      // Business Rule #3
      // Authenticated User
      //================================
      const authenticatedUser = req.user;
      const isReceiver =
        exchangeRequest.receiver.toString() ===
        authenticatedUser._id.toString();

      if (!isReceiver) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to complete this exchange request.",
        });
      }

      // ===============================
      // Business Rule #4
      // Only Accepted requests can be completed
      // ===============================
      if (exchangeRequest.status !== "Accepted") {
        return res.status(400).json({
          success: false,
          message: "Only accepted exchange requests can be completed.",
        });
      }

      //=============================
      // Update Status
      //=============================
      exchangeRequest.status = "Completed";
      await exchangeRequest.save();

      return res.status(200).json({
        success: true,
        message: "Exchange request completed successfully.",
        data: {
          _id: exchangeRequest._id,
          sender: exchangeRequest.sender,
          receiver: exchangeRequest.receiver,
          offeredSkill: exchangeRequest.offeredSkill,
          offeredSkillName: exchangeRequest.offeredSkillName,
          requestedSkill: exchangeRequest.requestedSkill,
          requestedSkillName: exchangeRequest.requestedSkillName,
          status: exchangeRequest.status,
          message: exchangeRequest.message,
          createdAt: exchangeRequest.createdAt,
          updatedAt: exchangeRequest.updatedAt,
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
  },
);

module.exports = { CompleteExchangeRequestRouter };
