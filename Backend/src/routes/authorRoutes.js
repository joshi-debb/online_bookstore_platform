const express = require("express");
const {
  getAuthors,
  createAuthor,
  deleteAuthor,
} = require("../controllers/authorController");
const router = express.Router();

router.get("/", getAuthors);
router.post("/", createAuthor);
router.delete("/:author_id", deleteAuthor);

module.exports = router;
