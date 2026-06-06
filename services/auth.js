const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET_KEY;

function setToken(user){
    return jwt.sign({
        _id: user.id,
        role: user.role,
    },SECRET);
}

function verifyToken(token){
    if(!token) return null;
    return jwt.verify(token,SECRET);
}

module.exports = {
    setToken,
    verifyToken
}