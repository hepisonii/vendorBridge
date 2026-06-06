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
    if(!req.user){
      return res.redirect("/user/login");
    }
    console.log("User: ",user);
    const vendor = await Vendor.findById(user.vendorId);
    console.log("Vendor", vendor);
    if(!vendor){
      return res.json({
        vendor: null,
        fullname: user.fullname,
        username: user.username,
      })
    }
    return res.json({
      vendor,
      fullname: user.fullname,
      username: user.username,
    });
});

apiRouter.get("/mentors", async (req,res) => {
   
});


module.exports = apiRouter