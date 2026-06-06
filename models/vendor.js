const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  gstNumber: {
    type: String,
    required: true
  },

  contactNumber: String,

  category: {
    type: String
  },

  status: {
    type: String,
    enum: ["DRAFT","PENDING", "APPROVED", "REJECTED", "BLOCKED"],
    default: "DRAFT"
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  approvedAt: Date

}, {
  timestamps: true
});

module.exports = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);