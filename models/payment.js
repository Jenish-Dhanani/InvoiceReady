const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    date: {type:Date, required:true},
    customerid: {type:mongoose.Schema.Types.ObjectId, required:true},
    sellerid: {type:mongoose.Schema.Types.ObjectId, required:true},
    amount:{type:Number,required:true},
    method:{type:String}
});

module.exports = mongoose.model('payment',paymentSchema);