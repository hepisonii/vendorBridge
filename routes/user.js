const express = require("express");
const userRouter = express.Router();
const {upload} = require("../cloudConfig")
const {
    handleGetUserSignUp,
    handlePostUserSignup,
    handleGetUserLogin,
    handlePostUserLogin,
    handleGetUserLogout,
    //handleGetUserSettings,
    //handlePatchUserSettings,
    handlePostSignup
} = require("../controllers/user");
const { limiter } = require("../middlewares/auth");


userRouter.get("/signup",handleGetUserSignUp);
userRouter.post("/signup",upload.single("photo"), handlePostUserSignup);
userRouter.get("/login", handleGetUserLogin);
userRouter.post("/login",limiter, handlePostUserLogin);
// userRouter.get("/settings", handleGetUserSettings);
// userRouter.patch("/settings", handlePatchUserSettings);
userRouter.get("/logout", handleGetUserLogout);
userRouter.get("/signup/staff", async (req,res) => {
    return res.render("oma_signup.ejs");
});
userRouter.post("/signup/staff", handlePostSignup);
module.exports = userRouter;