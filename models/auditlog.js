const mongoose = require("mongoose")

const auditLogSchema = new mongoose.Schema({

  action: String,

  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  targetId: mongoose.Schema.Types.ObjectId,

  details: Object

}, { timestamps: true });

module.exports = mongoose.model("AuditLog", auditLogSchema) || mongoose.models.AuditLog;