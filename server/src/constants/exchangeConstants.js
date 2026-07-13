/**
 * ===============================
 * Exchange Request Status
 * ===============================
 *
 * Represents the lifecycle of an exchange request
 */

const EXCHANGE_REQUEST_STATUS = [
  "Pending",
  "Accepted",
  "Rejected",
  "Cancelled",
  "Completed",
];

// Export Module
module.exports = { EXCHANGE_REQUEST_STATUS };
