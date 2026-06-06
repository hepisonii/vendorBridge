const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema({

  /* 🔗 REFERENCES */
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

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  bidId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bid",
    required: true
  },

  /* 💰 ORDER DETAILS */
  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: "INR"
  },

  /* 📦 ITEM DETAILS (flexible) */
  items: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],

  /* 📍 DELIVERY DETAILS */
  deliveryAddress: {
    type: String
  },

  deliveryDate: {
    type: Date
  },

  /* 📄 STATUS */
  status: {
    type: String,
    enum: [
      "generated",     // created
      "sent",          // sent to vendor
      "accepted",      // vendor accepted
      "rejected",      // vendor rejected
      "completed",     // delivered
      "cancelled"
    ],
    default: "generated"
  },

  /* 🧾 PAYMENT */
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  /* 📝 NOTES */
  notes: String,

  /* 🔐 TRACKING */
  generatedAt: {
    type: Date,
    default: Date.now
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  approvedAt: Date

}, {
  timestamps: true
});

module.exports =
  mongoose.models.PurchaseOrder ||
  mongoose.model("PurchaseOrder", purchaseOrderSchema);