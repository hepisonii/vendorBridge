const Vendor = require("../models/Vendor");
const User = require("../models/User");

const handlePostVendorProfile = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT

    const {
      name,
      email,
      gstNumber,
      contactNumber,
      category
    } = req.body;

    // 🔒 1. Only vendor role allowed
    const user = await User.findById(userId);

    if (user.role !== "VENDOR") {
      return res.status(403).json({
        message: "Only vendors can create profile"
      });
    }

    // ⚠️ 2. Prevent duplicate profile
    if (user.vendorId) {
      return res.status(400).json({
        message: "Vendor profile already exists"
      });
    }

    // 🔥 3. Create vendor
    const vendor = await Vendor.create({
      name,
      email,
      gstNumber,
      contactNumber,
      category,
      status: "PENDING"
    });

    // 🔗 4. Link to user
    user.vendorId = vendor._id;
    await user.save();

    return res.status(201).json({
      message: "Vendor profile created, pending approval",
      vendor
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

const handlePatchVendorProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔍 1. Get user
    const user = await User.findById(userId);

    if (!user || user.role !== "VENDOR") {
      return res.status(403).json({
        message: "Only vendors can update profile"
      });
    }

    // ❗ 2. Check vendor profile exists
    if (!user.vendorId) {
      return res.status(400).json({
        message: "Vendor profile does not exist"
      });
    }

    // 🔍 3. Fetch vendor
    const vendor = await Vendor.findById(user.vendorId);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found"
      });
    }

    // 🔒 4. Restrict editing after approval
    if (vendor.status === "APPROVED") {
      return res.status(403).json({
        message: "Approved profile cannot be edited"
      });
    }

    // 🧹 5. Allowed fields only
    const allowedFields = [
      "name",
      "email",
      "gstNumber",
      "contactNumber",
      "category"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        vendor[field] = req.body[field];
      }
    });

    // 🔄 6. If rejected → resubmit
    if (vendor.status === "REJECTED") {
      vendor.status = "PENDING";
    }

    await vendor.save();

    return res.status(200).json({
      message: "Vendor profile updated successfully",
      vendor
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
    handlePostVendorProfile,
    handlePatchVendorProfile
};