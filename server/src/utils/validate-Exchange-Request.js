const mongoose = require("mongoose");
const validator = require("validator");

/**
 * ==================================
 * Validate Exchange Request Data
 * ==================================
 */
const validateExchangeRequest = (req) => {
  //=============================
  // Allowed Fields Validation
  //=============================
  const allowedFields = [
    "receiverId",
    "offeredSkillId",
    "requestedSkillId",
    "message",
  ];
  const requestFields = Object.keys(req.body);
  if (requestFields.length === 0) {
    throw new Error("Request Body cannot be empty.");
  }

  const isValidRequest = requestFields.every((field) =>
    allowedFields.includes(field),
  );

  if (!isValidRequest) {
    throw new Error("Invalid request field.");
  }

  // ======================================
  // Extract Fields
  // ======================================
  const { receiverId, offeredSkillId, requestedSkillId, message } = req.body;

  // ======================================
  // Receiver Id Validation
  // ======================================

  // Type Validation
  if (typeof receiverId !== "string") {
    throw new Error("Invalid Receiver Id.");
  }

  // Sanitize
  req.body.receiverId = receiverId.trim();

  const sanitizedReceiverId = req.body.receiverId;

  // Empty Validation
  if (validator.isEmpty(sanitizedReceiverId)) {
    throw new Error("Receiver Id is required.");
  }

  // MongoDB ObjectId Validation
  if (!mongoose.Types.ObjectId.isValid(sanitizedReceiverId)) {
    throw new Error("Invalid Receiver Id.");
  }

  // ======================================
  // Offered Skill Id Validation
  // ======================================

  // Type Validation
  if (typeof offeredSkillId !== "string") {
    throw new Error("Invalid Offered Skill Id.");
  }

  // Sanitize
  req.body.offeredSkillId = offeredSkillId.trim();

  const sanitizedOfferedSkillId = req.body.offeredSkillId;

  // Empty Validation
  if (validator.isEmpty(sanitizedOfferedSkillId)) {
    throw new Error("Offered Skill Id is required.");
  }

  // MongoDB ObjectId Validation
  if (!mongoose.Types.ObjectId.isValid(sanitizedOfferedSkillId)) {
    throw new Error("Invalid Offered Skill Id.");
  }

  // ======================================
  // Requested Skill Id Validation
  // ======================================

  // Type Validation
  if (typeof requestedSkillId !== "string") {
    throw new Error("Invalid Requested Skill Id.");
  }

  // Sanitize
  req.body.requestedSkillId = requestedSkillId.trim();

  const sanitizedRequestedSkillId = req.body.requestedSkillId;

  // Empty Validation
  if (validator.isEmpty(sanitizedRequestedSkillId)) {
    throw new Error("Requested Skill Id is required.");
  }

  // MongoDB ObjectId Validation
  if (!mongoose.Types.ObjectId.isValid(sanitizedRequestedSkillId)) {
    throw new Error("Invalid Requested Skill Id.");
  }

  // ======================================
  // Message Validation
  // ======================================
  if ("message" in req.body) {
    // Type Validation
    if (typeof message !== "string") {
      throw new Error("Message must be a string.");
    }

    // Sanitize
    req.body.message = message.trim();

    const sanitizedMessage = req.body.message;

    // Maximum Length
    if (!validator.isLength(sanitizedMessage, { max: 300 })) {
      throw new Error("Message cannot exceed 300 characters.");
    }

    // Prevent HTML / XSS
    if (/<[^>]*>/.test(sanitizedMessage)) {
      throw new Error("Message contains invalid content.");
    }
  }
};

module.exports = { validateExchangeRequest };
