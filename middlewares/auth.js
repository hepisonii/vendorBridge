const {rateLimit, ipKeyGenerator} = require("express-rate-limit")
const { verifyToken } = require("../services/auth");
const User = require("../models/user");

function checkAuth(){
    return async (req,res,next) => {
        const providedToken = req.cookies?.uid;
        if(!providedToken){
            return next();
        }
            try{
                const decoded = verifyToken(providedToken);
                const user = await User.findById(decoded._id);
                req.user = user;
            }catch(err){}
            return next();
    }
}

const limiter = rateLimit({
    windowMs: 1*60*1000,
    max: 4,
 
    keyGenerator: (req) => {
        if (req.user?._id) {
            return req.user._id;
        }
        console.log("KEY:",req.ip);
        return req.ip;
    },    
    handler: (req,res) => {
        console.log("Limiter hit");
        res.status(429).json({
            message: "Too many requests"
        })
    },
    standardHeaders: true, // This shows remaining requests and reset time
    legacyHeaders: false,
})

module.exports = {
    checkAuth,
    limiter,
}