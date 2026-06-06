require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;

const {connectMongoDB} = require("./connections/connect");
const Path = require("path");
const cookieParser = require("cookie-parser");
const {checkAuth,checkRole} = require("./middlewares/auth");
const userRouter = require("./routes/user")
const vendorRouter = require("./routes/vendor");
const apiRouter = require("./routes/api");
const adminRouter = require("./routes/admin");
const officerRouter = require("./routes/officer");

connectMongoDB(process.env.MONGODB_URL);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkAuth());

app.set("view engine","ejs")
app.set("views", Path.resolve("./views"));

app.use("/user", userRouter);
app.use("/vendor", checkRole("vendor"),vendorRouter);
app.use("/admin", adminRouter);
app.use("/officer", officerRouter);
app.use("/api", apiRouter);

app.get("/", async (req,res) => {
    const user = req.user;
    if(!user){
        return res.redirect("/user/login");
    }
    if(user.role === "vendor"){
        return res.redirect("/vendor");
    }
})

app.listen(PORT, () => {
    console.log("Server Started");
});