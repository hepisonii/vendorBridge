const express = require("express");
const User = require("../models/user");
const apiRouter = express.Router();
const Vendor = require("../models/vendor");

apiRouter.get("/user", (req,res) => {
    return res.status(200).json(
      {
        _id: req.user._id,
        fullname: req.user.fullname,
        email: req.user.email,
        role: req.user.role,
    }
    );
})

apiRouter.get("/vendor",async (req,res) => {
  try {
      const { status } = req.query;
      if(status === "all"){
        const vendors = await Vendor.find({}).sort({createdAt: -1});
        return res.json({vendors});
      }
      const filter = {};
      if (status) filter.status = status;
  
      const vendors = await Vendor.find(filter).sort({ createdAt: -1 });
      console.log("Vendors: ",vendors);
      res.json({ vendors });
  
    } catch (err) {
      res.status(500).json({ message: "Error fetching vendors" });
    }
});


apiRouter.get("/vendor/me", async (req,res) => {
    if(!req.user){
      return res.redirect("/user/login");
    }
    const user = await User.findById(req.user._id);
    console.log("User: ",user);
    let vendor = null;
    if(user.vendorId){
      vendor = await Vendor.findById(user.vendorId);
    }
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

apiRouter.get("/vendor/verification", async (req,res) => {
  const vendor = await Vendor.findById(req.user._id);
    return res.json({
      status: vendor.status,
    })
  }
)

apiRouter.get("/mentors", async (req,res) => {
   
});


module.exports = apiRouter