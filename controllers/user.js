const express = require("express");
const User = require("../models/user");
const Vendor = require("../models/Vendor");
const OTP = require("../models/OTP");
const {cloudinary,upload} = require("../cloudConfig")
const fs = require("fs");


async function handleGetUserSignUp(req,res){
    return res.render("signup");
}

async function handlePostUserSignup(req, res){
  try {
    const { fullname, email, password, role, otp } = req.body;

    // 🚫 1. Prevent ADMIN signup
    if (role === "ADMIN") {
      return res.status(403).json({
        message: "Admin cannot signup directly"
      });
    }

    // 🔍 2. Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // 🔐 3. Hash password
    let isApproved = false;
    let vendorId = null;

    // 🏢 4. Vendor flow
    if (role === "VENDOR") {
      const vendor = await Vendor.create({
        name: fullname,
        email,
        status: "PENDING"
      });

      vendorId = vendor._id;
      isApproved = false; // admin will approve later
    }

    // 🔐 5. Manager / Officer flow (OTP required)
    if (["MANAGER", "PROCUREMENT_OFFICER"].includes(role)) {

      if (!otp) {
        return res.status(400).json({
          message: "OTP required for this role"
        });
      }

      const validOTP = await OTP.findOne({
        email,
        code: otp,
        roleRequested: role,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      if (!validOTP) {
        return res.status(400).json({
          message: "Invalid or expired OTP"
        });
      }

      // mark OTP used
      validOTP.isUsed = true;
      validOTP.usedAt = new Date();
      await validOTP.save();

      isApproved = true;
    }

    // 👤 6. Create user
    const user = await User.create({
      fullname,
      email,
      password,
      role,
      vendorId,
      isApproved
    });

    return res.redirect("/user/login");
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

async function handleGetUserLogin(req,res){
    return res.render("login");
}

async function handlePostUserLogin(req,res){
    const {email,password} = req.body;
    const token = await User.matchPassword(email,password)
     if(!token){
        return res.render("login", {
            error: "Invalid email or password"
        });
    }
    else{
    res.cookie("uid", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    return res.redirect("/");
    }
}

async function handleGetUserLogout(req,res){
    res.clearCookie("uid", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    return res.redirect("/user/login");
}

async function handleGetUserSettings(req,res){
    return res.sendFile(Path.resolve(__dirname, "../views/setting.html"))
}

async function handlePatchUserSettings(req, res) {
  try {
    const user = await User.findById(req.user._id);
    // 🔐 Allowed fields
    const allowedFields = ["fullname","username", "email", "gender", "age"];
    console.log("Body: ",req.body);
    // 🧠 Check username uniqueness
    if (req.body.username && req.body.username !== user.username) {
        const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Username already exists"
    });
  }
}
if (req.body.email && req.body.email !== user.email) {
        const existingUser = await User.findOne({ username: req.body.email });

    if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already exists"
    });
  }
}
    // 🔄 Update body fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // 🖼️ Image update
    if (req.file) {
      // 1️⃣ Upload new image
      const result = await cloudinary.uploader.upload(req.file.path);

      // 2️⃣ Delete old image
      if (user.profilePhotoId) {
        await cloudinary.uploader.destroy(user.profilePhotoId);
      }

      // 3️⃣ Save new values
      user.profileImageURL = result.secure_url;
      user.profilePhotoId = result.public_id;
    }

    await user.save();

    res.json({
      success: true,
      data: user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
}

module.exports = {
    handleGetUserSignUp,
    handlePostUserSignup,
    handleGetUserLogin,
    handlePostUserLogin,
    handleGetUserLogout,
}