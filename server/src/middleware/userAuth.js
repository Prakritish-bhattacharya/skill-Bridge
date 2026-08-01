const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/User-Model");

/**
 * ======================================
 * Authentication Middleware
 * ======================================
 */
const userAuth = async (req, res, next) => {
  try {
    // ===============================
    // Read JWT Token
    // ===============================
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // ===============================
    // Ensure JWT Secret Exists
    // ===============================
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret is not configured.");
    }

    // ===============================
    // Verify JWT
    // ===============================
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // ===============================
    // Extract User ID
    // ===============================
    const { _id } = decodedToken;

    // ===============================
    // Find User
    // ===============================
    const user = await UserModel.findById(_id).select(
      "_id firstName lastName emailId gender photoUrl credits skills",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // ===============================
    // Attach User
    // ===============================
    req.user = user;

    next();
  } catch (error) {
    console.error(error);

    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

module.exports = { userAuth };
