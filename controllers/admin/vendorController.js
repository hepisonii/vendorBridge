const express = require("express");
const User = require("../../models/user");
const Vendor = require("../../models/vendor");

const getAllVendors = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const vendors = await Vendor.find(filter).sort({ createdAt: -1 });

    res.json({ vendors });

  } catch (err) {
    res.status(500).json({ message: "Error fetching vendors" });
  }
};

const approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.status = "approved";
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

    vendor.status = "rejected";
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

    vendor.status = "blocked";

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