const express = require("express");
const User = require("../models/user");
const apiRouter = express.Router();
const Vendor = require("../models/vendor");

apiRouter.get("/user", (req,res) => {
    return res.status(200).json(
      {
        _id: req.user._id,
        fullname: req.user.fullname,
        username: req.user.username,
        email: req.user.email,
        gender: req.user.gender,
        age: req.user.age,
        profileImageURL: req.user.profileImageURL,
        age: req.user.age,
        role: req.user.role,
    }
    );
})


apiRouter.get("/vendor/me", async (req,res) => {
    const user = req.user;
    const vendor = Vendor.findById(user.vendorId);
    if(!vendor){
      return res.json({
        vendor: false,
      })
    }
    return res.json({
      vendor: true,
    });
});

apiRouter.get("/mentors", async (req,res) => {
   
});


module.exports = apiRouter