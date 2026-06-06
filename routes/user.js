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
    //handlePatchUserSettings
} = require("../controllers/user");
const { limiter } = require("../middlewares/auth");


userRouter.get("/signup",handleGetUserSignUp);
userRouter.post("/signup",upload.single("photo"), handlePostUserSignup);
userRouter.get("/login", handleGetUserLogin);
userRouter.post("/login",limiter, handlePostUserLogin);
// userRouter.get("/settings", handleGetUserSettings);
// userRouter.patch("/settings", handlePatchUserSettings);
userRouter.get("/logout", handleGetUserLogout);

module.exports = userRouter;