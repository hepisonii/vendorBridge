const mongoose = require("mongoose");

const rfqSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: String,

  budget: Number,

  deadline: Date,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open"
  },
    isApproved: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model("RFQ", rfqSchema) || mongoose.models.RFG;