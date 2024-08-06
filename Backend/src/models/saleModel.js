const mongoose = require('mongoose');

const bookSaleSchema = new mongoose.Schema({
    book: { type: String },
    book_id: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number }
}, { _id: false });

const saleSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now, required: true },
    order_id: { type: String, required: true },
    customer: { type: String, required: true },
    customer_id: { type: String, required: true },
    books: [bookSaleSchema],
    total: { type: Number, required: true }
});


const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;