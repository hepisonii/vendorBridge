const mongoose = require("mongoose")
const {createHmac, randomBytes} = require("crypto");
const {setToken} = require("../services/auth")
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },

  role: {
    type: String,
    enum: ["admin", "officer", "manager", "vendor"],
    required: true
  },

  // 🔗 Link vendor users to vendor entity
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    default: null
  },

  isActive: {
    type: Boolean,
    default: true
  },

  // 🔐 For forgot password
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // 🕒 Tracking
  lastLogin: Date

}, {timestamps: true});

const bcrypt = require("bcryptjs");

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User ||mongoose.model("User", userSchema);