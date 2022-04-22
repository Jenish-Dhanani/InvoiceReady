const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    cname: {type:String, required:true},
    email:{type:String, required: true},
    phone:{type:Number, required:true},
    address: {type:String, required:true},
    sellerid: {type:String, required:true},
});

module.exports = mongoose.model('customer',customerSchema);