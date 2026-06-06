const express = require("express");
const User = require("../models/user");
const apiRouter = express.Router();

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


apiRouter.get("/mentor/profile", async (req,res) => {
    
});

apiRouter.get("/mentors", async (req,res) => {
   
});


module.exports = apiRouter