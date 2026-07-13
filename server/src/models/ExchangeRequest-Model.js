const mongoose = require("mongoose");
const { EXCHANGE_REQUEST_STATUS } = require("../constants/exchangeConstants");

const exchangeRequestSchema = new mongoose.Schema(
  {
    /**
     * ======================================
     * Sender
     * User who initiates the exchange
     * ======================================
     */
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /**
     * ======================================
     * Receiver
     * User who receives the request
     * ======================================
     */
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /**
     * ======================================
     * Offered Skill
     * Sender's Teaching Skill
     * ======================================
     */
    offeredSkill: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    offeredSkillName: {
      type: String,
      required: true,
      trim: true,
    },
    /**
     * =====================================
     * Requested Skill
     * Receiver's Teaching Skill
     * =====================================
     */
    requestedSkill: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    requestedSkillName: {
      type: String,
      required: true,
      trim: true,
    },
    /**
     * ====================================
     * Optional Message
     * ====================================
     */
    message: {
      type: String,
      trim: true,
      maxlength: [300, "Message cannot exceed 300 characters !!!"],
      default: "",
    },
    /**
     * =====================================
     * Exchange Request Status
     * =====================================
     */
    status: {
      type: String,
      enum: EXCHANGE_REQUEST_STATUS,
      default: "Pending",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * ===============Create Compound Index==============
 * ==>This Compound Index Speeds up duplicate-request checks because MongoDB can efficiently search using all four fields together.
 * (**) This Index improves lookup performance but doesn't enforce "Only one pending request"
 * ==================================================
 */
exchangeRequestSchema.index(
  {
    sender: 1,
    receiver: 1,
    offeredSkill: 1,
    requestedSkill: 1,
  },
  {
    name: "unique_pending_exchange_request",
    unique: true,
    partialFilterExpression: {
      status: "Pending",
    },
  },
);

// Create Model
const ExchangeRequestModel = mongoose.model(
  "ExchangeRequest",
  exchangeRequestSchema,
);

module.exports = { ExchangeRequestModel };
