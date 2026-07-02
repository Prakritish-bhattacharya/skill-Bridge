const { UserModel } = require("../models/User-Model");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    // read jwt token from cookie
    const { token } = req.cookies;

    // check if token exists
    if (!token) {
      throw new Error("Please Login !!!");
    }

    // verify JWT
    const decodeObj = jwt.verify(token, "skillBridge@123@#$&*");

    // Extract user id
    const { _id } = decodeObj;

    // find user
    const user = await UserModel.findById(_id);

    if (!user) {
      throw new Error("User not found !!!");
    }

    // Attached LoggedIn user to request
    req.user = user;

    // Move  to next Middleware
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = { userAuth };
