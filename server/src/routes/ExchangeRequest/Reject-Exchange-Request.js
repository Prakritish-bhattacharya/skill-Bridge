const express = require("express");
const mongoose = require("mongoose");

const { userAuth } = require("../../middleware/userAuth");
const { ExchangeRequestModel } = require("../../models/ExchangeRequest-Model");

const RejectExchangeRequestRouter = express.Router();

/**
 * ======================================
 * Reject Exchange Request
 * PATCH /api/v1/exchange-requests/:requestId/reject
 * ======================================
 */
RejectExchangeRequestRouter.patch(
  "/:requestId/reject",
  userAuth,
  async (req, res) => {
    try {
      //=============================
      // Business Rule #1
      // Extract Request Id
      //=============================
      const { requestId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Request Id !!!",
        });
      }

      //==============================
      // Business Rule #2
      // Fetch Exchange Request
      //==============================
      const exchangeRequest = await ExchangeRequestModel.findById(requestId);

      if (!exchangeRequest) {
        return res.status(404).json({
          success: false,
          message: "Exchange Request Not Found !!!",
        });
      }

      //===============================
      // Logged In User
      //===============================
      const loggedInUser = req.user;
      // ===============================
      // Business Rule #3
      // Only Receiver can Reject
      // ===============================
      if (exchangeRequest.receiver.toString() !== loggedInUser._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to reject this exchange request !!!",
        });
      }

      // ===============================
      // Business Rule #4
      // Only Pending requests can be rejected
      // ===============================
      if (exchangeRequest.status !== "Pending") {
        return res.status(400).json({
          success: false,
          message: "Only pending exchange requests can be rejected !!!",
        });
      }
      // ===============================
      // Business Rule #5
      // Update Exchange Request Status
      // ===============================
      exchangeRequest.status = "Rejected";
      await exchangeRequest.save();



      return res.status(200).json({
        success: true,
        message: "Exchange request rejected successfully.",
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

module.exports = { RejectExchangeRequestRouter };
