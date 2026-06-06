const express = require("express");
const vendorRouter = express.Router();
const Path = require("path")
vendorRouter.get("/profile", (req,res) => {
    return res.sendFile(Path.resolve(__dirname, "./views/profile.html"));
});

vendorRouter.patch("/profile", handlePatch)