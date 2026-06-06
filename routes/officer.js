const express = require("express");
const router = express.Router();
const {checkAuth, checkRole} = require("../middlewares/auth")
router.use("/", checkAuth() , checkRole("officer"));
const {
  getOfficerDashboard,
  createRFQ,
  getMyRFQs,
  getRFQDetails,
  closeRFQ,
  getRFQBids,
  selectBid,
  generatePO
} = require("../controllers/officer")
/* ── Dashboard ── */
router.get("/", (req,res) => {
    return res.sendFile(require("path").resolve(__dirname, "../views/officer_home.html"));
})

router.get("/dashboard", getOfficerDashboard);

/* ── RFQ ── */
router.get("/create/rfqs", (req,res) => {
    return res.sendFile(require("path").resolve(__dirname, "../views/vendor_bids.html"));
})
router.post("/rfq", createRFQ);
router.get("/rfq", getMyRFQs);
router.get("/rfq/:id", getRFQDetails);
router.patch("/rfq/:id/close", closeRFQ);

/* ── Bids ── */
router.get("/rfq/:id/bids", getRFQBids);
router.patch("/bid/:id/select", selectBid);

/* ── Purchase Order ── */
router.post("/po", generatePO);

module.exports = router;