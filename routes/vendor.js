const express = require("express");
const vendorRouter = express.Router();
const Path = require("path");

const {
    handlePostVendorProfile,
    handlePatchVendorProfile,
    getAvailableRFQs,
    submitBid,
    getMyBids,
} = require("../controllers/vendor");
const { checkRole } = require("../middlewares/auth");


vendorRouter.get("/", (req,res) => {
    return res.sendFile(Path.resolve(__dirname, "../views/vendor_home.html"));
})
vendorRouter.get("/profile", (req,res) => {
    return res.sendFile(Path.resolve(__dirname, "../views/vendor_profile.html"));
});

vendorRouter.post("/profile", handlePostVendorProfile);
vendorRouter.patch("/profile", handlePatchVendorProfile);

vendorRouter.get("/rfqs", getAvailableRFQs);

vendorRouter.post("/bid", submitBid);

vendorRouter.get("/bids", getMyBids);

module.exports = vendorRouter;