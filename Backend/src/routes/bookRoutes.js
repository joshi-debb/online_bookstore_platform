const express = require("express");

const {
  addBook,
  getBooksByAuthor,
  deleteBook,
  updateBook,
  getBookById,
  getBooks,
  addReview,
  allGenres,
  getAllBooksByIds,
  getReviews
} = require("../controllers/bookController");

const router = express.Router();

router.post("/", addBook);
router.get("/", getBooks);
router.get("/allgenres", allGenres);
router.get("/author/:author_id", getBooksByAuthor);
router.get("/:book_id", getBookById);
router.delete("/:book_id", deleteBook);
router.put("/:book_id", updateBook);
router.put("/review/:book_id", addReview)
router.post("/allbooks", getAllBooksByIds)
router.get("/getReviews/:book_id", getReviews)


module.exports = router;