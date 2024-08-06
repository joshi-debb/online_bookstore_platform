const mongoose = require("mongoose")

const bookSaleSchema = new mongoose.Schema({
    book: { type: String },
    book_id: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number }
}, { _id: false });

const orderSchema = mongoose.Schema({
    user: {type: String, required: true},
    user_id: {type: String, required: true},
    address: {type: String, required: true},
    books: [bookSaleSchema] ,
    status: {type:String, required: true},
    date: {type: Date, required: true},
    total: {type: Number, required: true, default: 0},
})


const Order = mongoose.model("Order", orderSchema)

module.exports = Order;