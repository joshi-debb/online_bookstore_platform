const express = require("express");
const {
    createSale,
    getTopSales
} = require("../controllers/saleController");
const router = express.Router();

router.post("/", createSale);
router.get("/", getTopSales);

module.exports = router;
