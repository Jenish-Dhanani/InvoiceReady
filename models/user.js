const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fname: {type:String, required:true},
    lname: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    cname:{type:String, required:true},
    address: {type:String, required: true},
    gstin:{type: String, required: true, unique: true},
});

module.exports = mongoose.model('user',userSchema);