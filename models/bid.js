const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({

  rfqId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RFQ",
    required: true
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true
  },

  quotedPrice: {
    type: Number,
    required: true
  },

  message: String,

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Bid", bidSchema) || mongoose.models.Bid;