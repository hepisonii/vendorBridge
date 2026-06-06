const mongoose = require("mongoose");

const inviteCodeSchema = new mongoose.Schema({

  code: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["manager", "procurement_officer"],
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  createdByRole: {
    type: String
  },

  isUsed: {
    type: Boolean,
    default: false
  },

  expiresAt: {
    type: Date,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.models.InviteCode || mongoose.model("InviteCode", inviteCodeSchema);