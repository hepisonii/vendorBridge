const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },

  code: {
    type: String,
    required: true
  },

  roleRequested: {
    type: String,
    enum: ["MANAGER", "PROCUREMENT_OFFICER"],
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true   // admin who generated OTP
  },

  expiresAt: {
    type: Date,
    required: true,
    index: true
  },

  isUsed: {
    type: Boolean,
    default: false
  },

  usedAt: Date

}, {
  timestamps: true
});

module.exports = mongoose.model("OTP", otpSchema);