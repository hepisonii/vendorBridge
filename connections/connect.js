const {connect} = require("mongoose")

function connectMongoDB (url){
    connect(url)
    .then(() => {
        console.log("MongoDB connected")
    })
    .catch((err) => {
        console.log("Error: ",err);
    })
}

module.exports = {
    connectMongoDB
}