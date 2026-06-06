const express = require("express");
const User = require("../../models/user");

const getOfficers = async (req, res) => {
  try {
    const officers = await User.find({
      role: "procurement_officer"
    });

    res.json({ officers });

  } catch (err) {
    res.status(500).json({ message: "Error fetching officers" });
  }
};

const getManagers = async (req, res) => {
  try {
    const managers = await User.find({
      role: "manager"
    });

    res.json({ managers });

  } catch (err) {
    res.status(500).json({ message: "Error fetching managers" });
  }
};

const updateApprovalStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: "Staff approved", user });

  } catch (err) {
    res.status(500).json({ message: "Error approving staff" });
  }
};

module.exports = {
  getOfficers,
  getManagers,
  updateApprovalStatus
}