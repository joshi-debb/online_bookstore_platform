const express = require("express");

const {
    createOrder,
    getOrders,
    getOrderByUserId,
    getOrdersInProgress,
    updateOrderStateToSent,
    updateOrderStateToDelivered
} = require("../controllers/orderController");


const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/user/:user_id", getOrderByUserId);
router.get("/inprogress", getOrdersInProgress);
router.put("/sttSent/:order_id", updateOrderStateToSent);
router.put("/sttDelivered/:order_id", updateOrderStateToDelivered);


module.exports = router;