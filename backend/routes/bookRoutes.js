const express = require('express');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/public', getBooks);
router.get('/public/:id', getBookById);

// Protected routes
router.route('/')
  .get(protect, getBooks)
  .post(protect, upload, createBook);

router.route('/:id')
  .get(protect, getBookById)
  .put(protect, upload, updateBook)
  .delete(protect, deleteBook);

module.exports = router;