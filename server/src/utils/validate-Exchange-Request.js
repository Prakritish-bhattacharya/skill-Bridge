const mongoose = require("mongoose");
const validator = require("validator");

/**
 * ==================================
 * Validate Exchange Request Data
 * ==================================
 */
const validateExchangeRequest = (req) => {
  //=============================
  // Sanitize request Body
  // ============================
  if (req.body.receiverId) {
    req.body.receiverId = req.body.receiverId.trim();
  }

  if (req.body.offeredSkillId) {
    req.body.offeredSkillId = req.body.offeredSkillId.trim();
  }

  if (req.body.requestedSkillId) {
    req.body.requestedSkillId = req.body.requestedSkillId.trim();
  }

  if (req.body.message) {
    req.body.message = req.body.message.trim();
  }

  // ======================================
  // Extract Fields
  // ======================================
  const { receiverId, offeredSkillId, requestedSkillId, message } = req.body;

  // ======================================
  // Required Skill Validation
  // ======================================
  if (!receiverId) {
    throw new Error("Receiver Id is Required !!!");
  }

  if (!offeredSkillId) {
    throw new Error("Offered Skill Id is required !!!");
  }

  if (!requestedSkillId) {
    throw new Error("Requested Skill Id is required !!!");
  }

  // ======================================
  // MongoDB ObjectId validation
  // ======================================
  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new Error("Invalid Receiver Id !!!");
  }

  if (!mongoose.Types.ObjectId.isValid(offeredSkillId)) {
    throw new Error("Invalid Offered Skill Id !!!");
  }

  if (!mongoose.Types.ObjectId.isValid(requestedSkillId)) {
    throw new Error("Invalid Request Skill Id !!!");
  }

  // ======================================
  // Message Validation
  // ======================================
  if (message && !validator.isLength(message, { max: 300 })) {
    throw new Error("Message cannot be exceed 300 characters !!!");
  }
};

module.exports = { validateExchangeRequest };
