const express = require("express");
const User = require("../models/user");
const Vendor = require("../models/Vendor");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const {cloudinary,upload} = require("../cloudConfig")
const fs = require("fs");


async function handleGetUserSignUp(req,res){
    return res.render("signup");
}

const handlePostUserSignup = async (req, res) => {
  try {
    const { fullname, email, password, role, otp } = req.body;

    // 🚫 1. Block direct ADMIN signup
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

    let isApproved = false;

    // 🔐 3. OTP validation for privileged roles
    if (["MANAGER", "PROCUREMENT_OFFICER"].includes(role)) {

      if (!otp) {
        return res.status(400).json({
          message: "OTP is required for this role"
        });
      }

      const validOTP = await OTP.findOneAndUpdate(
        {
          email,
          code: otp,
          roleRequested: role,
          isUsed: false,
          expiresAt: { $gt: new Date() }
        },
        {
          $set: {
            isUsed: true,
            usedAt: new Date()
          }
        },
        { new: true }
      );

      if (!validOTP) {
        return res.status(400).json({
          message: "Invalid or expired OTP"
        });
      }

      isApproved = true;
    }

    // 🔐 4. Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 👤 5. Create user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
      isApproved,
      vendorId: null
    });

    return res.status(201).json({
      message: "Signup successful",
      userId: user._id
    });

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

const { setToken } = require("../services/auth");

const handlePostUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 1. Find user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // 🔐 2. Match password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).render("login",{
        message: "Invalid email or password"
      });
    }

    // 🚫 3. Check active
    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is deactivated"
      });
    }

    // ⚠️ 4. Approval check
    if (
      ["MANAGER", "PROCUREMENT_OFFICER"].includes(user.role) &&
      !user.isApproved
    ) {
      return res.status(403).json({
        message: "Account not approved yet"
      });
    }

    // 🔐 5. Generate token via service
    const token = setToken(user);
    res.cookie("uid", token, {
      httpOnly: true,
        secure: false,
        sameSite: "lax",
    })
    // 🕒 6. Update last login
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).redirect("/vendor");

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

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