const express = require("express");

const {
  loginUser,
  registerUser,
  updateUser,
  getUser
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.put("/update/:user_id", updateUser);
router.get("/getUser/:user_id", getUser);

module.exports = router;