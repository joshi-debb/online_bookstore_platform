const Order = require('../models/orderModel');
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const Sale = require('../models/saleModel');

exports.createOrder = async (req, res) => {

    try {
        const db = await getDB();
        if (db == null) {
            return res.status(500).json({ message: "Error connecting to database" });
        }
        const newOrder = new Order(req.body);
        newOrder.date = new Date();
        newOrder.status = "in progress";
        const validateOrder = await newOrder.validateSync();
        if (validateOrder) {
            return res.status(400).json({ message: validateOrder.message, status: false });
        }
        //verificar que tengan existancia los libros
        let total = 0;
        const booksOrder = req.body.books;
        for (let i = 0; i < booksOrder.length; i++) {
            const book_id = booksOrder[i].book_id;
            const _book_id = new ObjectId(book_id);
            const book = await db.collection("Books").findOne({ _id: _book_id });
            if (book.quantityAvailable < booksOrder[i].quantity) {
                return res.status(400).json({ message: "Quantity book "+ book_id +" not available", status: false });
            }
            booksOrder[i].book = book.title;
            booksOrder[i].price = book.price;
            total += book.price * booksOrder[i].quantity;
            
            await db.collection("Books").updateOne({ _id: _book_id }, { $inc: { quantityAvailable: -booksOrder[i].quantity } });
        }
        newOrder.books = booksOrder;
        newOrder.total = total;
        await db.collection("Orders").insertOne(newOrder);
        return res.status(201).json({ message: "Order created successfully", status: true });
    } catch (error) {
        return res.status(400).json({ message: error.message, status: false });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const db = await getDB();
        if (db == null) {
            return res.status(500).json({ message: "Error connecting to database" });
        }
        const orders = await db.collection("Orders").find({}).toArray();
        return res.status(200).json({ data: orders, status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}

exports.getOrderByUserId = async (req, res) => {
    try {
        const db = await getDB();
        if (db == null) {
            return res.status(500).json({ message: "Error connecting to database" });
        }
        const user_id = req.params.user_id;
        const orders = await db.collection("Orders").find({ user_id: user_id }).toArray();
        return res.status(200).json({ data: orders, status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}

exports.getOrdersInProgress = async (req, res) => {
    try {
        const db = await getDB();
        if (db == null) {
            return res.status(500).json({ message: "Error connecting to database" });
        }
        const status = req.params.status;
        const orders = await db.collection("Orders").find({ status: "in progress" }).toArray();
        return res.status(200).json({ data: orders, status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}

exports.updateOrderStateToSent = async (req, res) => {
    try {
        const db = await getDB();
        if (db == null) {
            return res.status(500).json({ message: "Error connecting to database" });
        }
        const order_id = req.params.order_id;
        const _order_id = new ObjectId(order_id);
        const order = await db.collection("Orders").findOne({ _id: _order_id });
        if (!order) {
            return res.status(404).json({ message: "Order not found", status: false });
        }
        if (order.status != "in progress") {
            return res.status(400).json({ message: "Order can not be updated", status: false });
        }
        const status = "sent";
        await db.collection("Orders").updateOne({ _id: _order_id }, { $set: { status: status } });
        return res.status(200).json({ message: "Order updated successfully", status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}

exports.updateOrderStateToDelivered = async (req, res) => {
    try {
        const db = await getDB();
        if (db == null) {
            return res.status(500).json({ message: "Error connecting to database" });
        }
        const order_id = req.params.order_id;
        const _order_id = new ObjectId(order_id);
        const order = await db.collection("Orders").findOne({ _id: _order_id });
        if (!order) {
            return res.status(404).json({ message: "Order not found", status: false });
        }
        if (order.status != "sent") {
            return res.status(400).json({ message: "Order can not be updated", status: false });
        }
        const status = "delivered";
        
        const newSale = new Sale();
        newSale.date = new Date();
        newSale.order_id = order_id;
        newSale.customer = order.user;
        newSale.customer_id = order.user_id;
        newSale.total = order.total;
        newSale.books = order.books;

        await db.collection("Orders").updateOne({ _id: _order_id }, { $set: { status: status } });
        
        await db.collection("Sale").insertOne(newSale);
        return res.status(200).json({ message: "Order updated successfully", status: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
}
