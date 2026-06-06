const express = require("express");
const router = express.Router();

const {checkAuth, checkRole} = require("../middlewares/auth");

const {
  getAllVendors,
  approveVendor,
  rejectVendor,
  blockVendor
} = require("../controllers/admin/vendorController");

const {
  getOfficers,
  getManagers,
  updateApprovalStatus
} = require("../controllers/admin/staffController");

// const {
//   getAnalytics
// } = require("../controllers/admin/analyticsController");

// 🔐 Only ADMIN
router.use(checkAuth(), checkRole("admin"));

router.get('/', async (req,res) => {
    return res.sendFile(require("path").resolve(__dirname, "../views/admin_pannel.html"))
})

/* ---------- Vendor ---------- */
router.get("/vendors", getAllVendors);
router.patch("/vendors/:id/approve", approveVendor);
router.patch("/vendors/:id/reject", rejectVendor);
router.patch("/vendors/:id/block", blockVendor);

/* ---------- Officers ---------- */
router.get("/officers", getOfficers);

/* ---------- Managers ---------- */
router.get("/managers", getManagers);

/* ---------- Approvals ---------- */
router.patch("/staff/:id/approve", updateApprovalStatus);

/* ---------- Analytics ---------- */
// router.get("/analytics", getAnalytics);

module.exports = router;