const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
    invoiceno: {type:Number, required:true},
    date: {type:Date, required:true},
    customerid: {type:mongoose.Schema.Types.ObjectId, required:true},
    sellerid: {type:mongoose.Schema.Types.ObjectId, required:true},
    items:{type:Array, required:true},
    note: {type:String},
    totalAmount:{type: Number, required: true},
    status:{type:String}
});

module.exports = mongoose.model('invoice',invoiceSchema);