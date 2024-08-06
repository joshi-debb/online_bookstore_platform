const Sale = require("../models/saleModel");
const { getDB } = require("../config/db");

exports.createSale = async (req, res) => {
  try {
    const db = await getDB();
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }
    const newSale = new Sale(req.body)
    const validateSale = await newSale.validateSync();
    if (validateSale) {
      res.status(400).json({ message: validateSale.message, status: false });
      return;
    }
    await db.collection("Sale").insertOne(newSale);
    return res.status(201).json({ message: "Sale created successfully", status: true });
  } catch (error) {
    return res.status(400).json({ message: error.message, status: false });
  }
};


exports.getTopSales = async (req, res) => {
  try {
    const db = await getDB();
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }
    const result = await db.collection("Sale").aggregate([
      { $unwind: "$books" },
      { $group: { _id: "$books.book", total: { $sum: "$books.quantity" } } },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ]).toArray();

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}
