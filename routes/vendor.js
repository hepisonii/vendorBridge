const express = require("express");
const vendorRouter = express.Router();
const Path = require("path");

const {
    handlePostVendorProfile,
    handlePatchVendorProfile
} = require("../controllers/vendor");


vendorRouter.get("/", (req,res) => {
    return res.sendFile(Path.resolve(__dirname, "../views/vendor_home.html"));
})
vendorRouter.get("/profile", (req,res) => {
    return res.sendFile(Path.resolve(__dirname, "../views/vendor_profile.html"));
});

vendorRouter.post("/profile", handlePostVendorProfile);
vendorRouter.patch("/profile", handlePatchVendorProfile);

module.exports = vendorRouter;