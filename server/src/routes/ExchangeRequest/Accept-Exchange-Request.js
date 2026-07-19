const express = require("express");
const { userAuth } = require("../../middleware/userAuth");
const mongoose = require("mongoose");
const { ExchangeRequestModel } = require("../../models/ExchangeRequest-Model");

const AcceptExchangeRequestRouter = express.Router();
/**
 * ======================================
 * Accept Exchange Request
 * PATCH /api/v1/exchange-requests/:requestId/accept
 * ======================================
 */
AcceptExchangeRequestRouter.patch(
  "/:requestId/accept",
  userAuth,
  async (req, res) => {
    try {
      // ===============================
      // Business Rule #1
      // Extract Request Id
      // ===============================
      const { requestId } = req.params;

      // ===============================
      // Validate Request Id
      // ===============================
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Request Id !!!",
        });
      }

      //================================
      // Business Rule #2
      // Fetch Exchange Request
      //================================
      const exchangeRequest = await ExchangeRequestModel.findById(requestId);
      // ===============================
      // Exchange Request must exist
      // ===============================
      if (!exchangeRequest) {
        return res.status(404).json({
          success: false,
          message: "Exchange Request not found !!!",
        });
      }

      // ===============================
      // Logged-In User
      // ===============================
      const loggedInUser = req.user;
      // ===============================
      // Business Rule #3
      // Compare the receiver with the logged-in user
      // Only Receiver can Accept
      // ===============================
      if (exchangeRequest.receiver.toString() !== loggedInUser._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to accept this exchange request !!!",
        });
      }

      // ===============================
      // Business Rule #4
      // Only Pending requests can be accepted
      // ===============================
      if (exchangeRequest.status !== "Pending") {
        return res.status(400).json({
          success: false,
          message: "Only pending exchange requests can be accepted !!!",
        });
      }

      // ===============================
      // Business Rule #5
      // Update Exchange Request Status
      // ===============================
      exchangeRequest.status = "Accepted";
      await exchangeRequest.save();

      return res.status(200).json({
        success: true,
        message: "Exchange request accepted successfully.",
        data: exchangeRequest,
      });

      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

module.exports = { AcceptExchangeRequestRouter };
