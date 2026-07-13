const express = require("express");

const { userAuth } = require("../../middleware/userAuth");
const { userModel, UserModel } = require("../../models/User-Model");
const { ExchangeRequestModel } = require("../../models/ExchangeRequest-Model");
const {
  validateExchangeRequest,
} = require("../../utils/validate-Exchange-Request");

const CreateExchangeRequestRouter = express.Router();

/**
 * ======================================
 * Send Exchange Request
 * POST /api/v1/exchange-requests
 * ======================================
 */
CreateExchangeRequestRouter.post("/", userAuth, async (req, res) => {
  try {
    // ===============================
    // Validate Request Body
    // ===============================
    validateExchangeRequest(req);

    //================================
    // Logged-In User (Sender)
    //================================
    const sender = req.user;

    //================================
    // Extract Request Body
    //================================
    const { receiverId, offeredSkillId, requestedSkillId, message } = req.body;

    /**
     * ===========================================
     * Business Rule #1
     * Sender cannot send request to himself
     * ===========================================
     */
    // sender._id is a ObjectId() and receiverId is a String. So need to convert in string
    if (sender._id.toString() === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send an request to yourself !!!",
      });
    }
    /**
     * ===========================================
     * Business Rule #2
     * Receiver must exists in the database
     * ===========================================
     */
    const receiver = await UserModel.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found !!!",
      });
    }
    /**
     * ===========================================
     * Business Rule #3
     * Sender must Own Offered Skill
     * ===========================================
     */
    const offeredSkill = sender.skills.id(offeredSkillId);
    if (!offeredSkill) {
      return res.status(404).json({
        success: false,
        message: "Offered Skill not found !!!",
      });
    }
    // console.log(offeredSkill);

    /**
     * ==========================================
     * Business Rule #4
     * Receiver must own Requested Skill
     * ==========================================
     */
    const requestedSkill = receiver.skills.id(requestedSkillId);
    if (!requestedSkill) {
      return res.status(404).json({
        success: false,
        message: "Requested Skill not found !!!",
      });
    }

    /**
     * ==========================================
     * Business Rule #5
     * Offered Skill must be Teach
     * ==========================================
     */
    if (offeredSkill.type !== "Teach") {
      return res.status(400).json({
        success: false,
        message: "Only teaching skill can be offered for exchange !!!",
      });
    }
    /**
     * ==========================================
     * Business Rule #6
     * Requested Skill must be Teach
     * ==========================================
     */
    if (requestedSkill.type !== "Teach") {
      return res.status(400).json({
        success: false,
        message: "Only teaching skills can be requested for exchange !!!",
      });
    }

    /**
     * ==========================================
     * Business Rule #7
     * Prevent Duplicate Pending Request
     * ==========================================
     */
    const existingRequest = await ExchangeRequestModel.findOne({
      sender: sender._id,
      receiver: receiver._id,
      offeredSkill: offeredSkill._id,
      requestedSkill: requestedSkill._id,
      status: "Pending",
    });
    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "Exchange request already exists !!!",
      });
    }

    /**
     * ==========================================
     * Create Exchange Request Document
     * ==========================================
     */
    const exchangeRequest = new ExchangeRequestModel({
      sender: sender._id,
      receiver: receiver._id,
      //--------------
      offeredSkill: offeredSkill._id,
      offeredSkillName: offeredSkill.skillName,
      //--------------
      requestedSkill: requestedSkill._id,
      requestedSkillName: requestedSkill.skillName,
      //--------------
      message,
    });

    /**
     * ==========================================
     * Save Exchange Request Document
     * ==========================================
     */
    await exchangeRequest.save();

    return res.status(201).json({
      success: true,
      message: "Step 1 completed successfully...",
      data: exchangeRequest,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = { CreateExchangeRequestRouter };
