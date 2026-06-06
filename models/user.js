const {Schema, model} = require("mongoose")
const {createHmac, randomBytes} = require("crypto");
const {setToken} = require("../services/auth")
const userSchema = new Schema({
    
}, {timestamps: true});

userSchema.pre("save", async function (){
    const user = this;
    if(!user.isModified("password")) return;
    const password = user.password;
    const salt = randomBytes(16).toString("hex");
    const hashed = createHmac("sha256", salt).update(password).digest("hex");
    user.password = hashed;
    user.salt = salt;
})

userSchema.static("matchPassword",async function (username,password){
    const user = await this.findOne({username});
    if(!user) return false;
    const salt = user.salt;
    const hashed = user.password;
    const providedHashed = createHmac("sha256", salt).update(password).digest("hex");
    if(providedHashed === hashed){
    const token = setToken(user);
    return token;
    }

})

const User = model("user", userSchema);

module.exports = User;