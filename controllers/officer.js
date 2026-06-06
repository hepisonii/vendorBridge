const RFQ = require("../models/RFQ");
const Bid = require("../models/Bid");
const PurchaseOrder = require("../models/PurchaseOrder");

/* ─────────────────────────────── */
/* 📊 DASHBOARD */
/* ─────────────────────────────── */
const getOfficerDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalRFQs = await RFQ.countDocuments({ createdBy: userId });
    const openRFQs = await RFQ.countDocuments({ createdBy: userId, status: "open" });
    const closedRFQs = await RFQ.countDocuments({ createdBy: userId, status: "closed" });

    const rfqIds = await RFQ.find({ createdBy: userId }).distinct("_id");

    const totalBids = await Bid.countDocuments({
      rfqId: { $in: rfqIds }
    });

    return res.json({
      totalRFQs,
      openRFQs,
      closedRFQs,
      totalBids
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Dashboard error" });
  }
};

/* ─────────────────────────────── */
/* 📄 CREATE RFQ */
/* ─────────────────────────────── */
const createRFQ = async (req, res) => {
  try {
    const { title, description, category, budget, deadline } = req.body;

    const rfq = await RFQ.create({
      title,
      description,
      category,
      budget,
      deadline,
      createdBy: req.user._id,
      status: "open"
    });

    return res.status(201).json({ rfq });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating RFQ" });
  }
};

/* ─────────────────────────────── */
/* 📋 GET MY RFQs */
/* ─────────────────────────────── */
const getMyRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    return res.json({ rfqs });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching RFQs" });
  }
};

/* ─────────────────────────────── */
/* 🔍 RFQ DETAILS */
/* ─────────────────────────────── */
const getRFQDetails = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id);

    if (!rfq) {
      return res.status(404).json({ message: "RFQ not found" });
    }

    return res.json({ rfq });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching RFQ" });
  }
};

/* ─────────────────────────────── */
/* 🔒 CLOSE RFQ */
/* ─────────────────────────────── */
const closeRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id);

    if (!rfq) {
      return res.status(404).json({ message: "RFQ not found" });
    }

    if (rfq.status === "closed") {
      return res.status(400).json({ message: "RFQ already closed" });
    }

    rfq.status = "closed";
    await rfq.save();

    return res.json({ message: "RFQ closed" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error closing RFQ" });
  }
};

/* ─────────────────────────────── */
/* 📑 GET BIDS FOR RFQ */
/* ─────────────────────────────── */
const getRFQBids = async (req, res) => {
  try {
    const bids = await Bid.find({ rfqId: req.params.id })
      .populate("vendorId");

    return res.json({ bids });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching bids" });
  }
};

/* ─────────────────────────────── */
/* 🏆 SELECT BID */
/* ─────────────────────────────── */
const selectBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    if (bid.status === "accepted") {
      return res.status(400).json({ message: "Bid already accepted" });
    }

    // Accept this bid
    bid.status = "accepted";
    await bid.save();

    // Reject others
    await Bid.updateMany(
      { rfqId: bid.rfqId, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    return res.json({ message: "Bid selected successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error selecting bid" });
  }
};

/* ─────────────────────────────── */
/* 📦 GENERATE PURCHASE ORDER */
/* ─────────────────────────────── */
const generatePO = async (req, res) => {
  try {
    const { bidId } = req.body;

    const bid = await Bid.findById(bidId).populate("vendorId rfqId");

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    if (bid.status !== "accepted") {
      return res.status(400).json({ message: "Only accepted bid can generate PO" });
    }

    const po = await PurchaseOrder.create({
      rfqId: bid.rfqId._id,
      vendorId: bid.vendorId._id,
      amount: bid.quotedPrice,
      createdBy: req.user._id,
      status: "generated"
    });

    return res.json({ po });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error generating PO" });
  }
};

module.exports = {
  getOfficerDashboard,
  createRFQ,
  getMyRFQs,
  getRFQDetails,
  closeRFQ,
  getRFQBids,
  selectBid,
  generatePO
};