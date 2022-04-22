const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config({path:"./config.env"})

const connectionUrl = process.env.DATABASE

function connectToDb(){
    mongoose.connect(connectionUrl).then(()=>{
        console.log("DB connected")
    }).catch((error)=>{
        console.log(error,"Db connection failed")
    })
}

module.exports = {connectToDb}