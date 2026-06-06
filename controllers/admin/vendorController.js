const express = require("express");
const User = require("../../models/user");
const Vendor = require("../../models/vendor");

const getAllVendors = async (req, res) => {
  return res.sendFile(require("path").resolve(__dirname, "../../views/manage_vendors.html"))
};

const approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.status = "APPROVED";
    vendor.approvedBy = req.user._id;
    vendor.approvedAt = new Date();

    await vendor.save();

    res.json({ message: "Vendor approved", vendor });

  } catch (err) {
    res.status(500).json({ message: "Error approving vendor" });
  }
};

const rejectVendor = async (req, res) => {
  try {
    const { reason } = req.body;

    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.status = "REJECTED";
    vendor.rejectionReason = reason || "Not specified";

    await vendor.save();

    res.json({ message: "Vendor rejected" });

  } catch (err) {
    res.status(500).json({ message: "Error rejecting vendor" });
  }
};

const blockVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.status = "BLOCKED";

    await vendor.save();

    res.json({ message: "Vendor blocked" });

  } catch (err) {
    res.status(500).json({ message: "Error blocking vendor" });
  }
};

module.exports = {
    getAllVendors,
  approveVendor,
  rejectVendor,
  blockVendor
}