const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "required_email"],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "invalid_email"],
    },
    password: {
      type: String,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
      default: null,
    },
    avatar_url: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: Boolean,
      default: "user",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
    },
  }
);

module.exports = mongoose.model("user", user);
