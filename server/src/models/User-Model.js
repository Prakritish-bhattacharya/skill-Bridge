const mongoose = require("mongoose"); // Import the mongoose module to interact with MongoDB
const validator = require("validator"); // Import the validator module to validate required fields
const {
  SKILL_CATEGORIES,
  SKILL_TYPES,
  SKILL_LEVELS,
} = require("../constants/skillConstants");
const jwt = require("jsonwebtoken");

/*===============================
 *  User Skill Subdocument Schema
 *  Each user owns multiple skills
 *===============================
 */
const userSkillSchema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: SKILL_CATEGORIES,
    },

    type: {
      type: String,
      required: true,
      enum: SKILL_TYPES,
    },

    level: {
      type: String,
      required: true,
      enum: SKILL_LEVELS,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description can't exceed 300 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Define a schema for the user registration data
const registerUserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String, // The first name of the user, which is a string
      required: true, // This field is required
    },
    lastName: {
      type: String,
      required: true, // This field is required
    },
    emailId: {
      type: String,
      required: true, // This field is required
      unique: true, // This field must be unique across all documents in the collection
      trim: true, // This field will be trimmed of whitespace from both ends
      lowercase: true, // This field will be converted to lowercase
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address !!!");
        }
      },
    },
    password: {
      type: String,
      required: true, // This field is required
      trim: true, // This field will be trimmed of whitespace from both ends
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please enter a Strong password !!!");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender is not Valid !!!");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.pngkey.com/png/full/115-1150152_default-profile-picture-avatar-png-green.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL !!!");
        }
      },
    },
    // 👇 rest of the things come from backend
    credits: {
      type: Number,
      default: 10,
      min: 0,
    },
    //This field tells whether the user has verified their email address.
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "blocked"],
      default: "active",
    },
    ipAddress: {
      type: String,
      default: null,
    },
    location: {
      country: {
        type: String,
        default: null,
      },
      state: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        default: null,
      },
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },
    timezone: {
      type: String,
      default: null,
    },
    device: {
      type: {
        type: String,
        enum: ["Desktop", "Mobile", "Tablet", "Unknown"],
        default: "Unknown",
      },
      browser: {
        type: String,
        default: null,
      },
      userAgent: {
        // userAgent is the complete identity string that the browser automatically sends with every HTTP request.
        type: String,
        default: null,
      },
    },
    os: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    skills: {
      type: [userSkillSchema],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields to the schema
  },
);

// Schema level JWT
registerUserSchema.methods.getJWT = function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, "skillBridge@123@#$&*", {
    expiresIn: "7d",
  });
  return token;
};

// create a model for the user registration data using the defined schema
const UserModel = mongoose.model("User", registerUserSchema);
// Export the UserModel to be used in other parts of the application
module.exports = { UserModel };
