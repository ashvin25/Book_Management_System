const express = require('express');
const {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} = require('../controllers/authorController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getAuthors)
  .post(protect, createAuthor);

router.route('/:id')
  .get(protect, getAuthorById)
  .put(protect, updateAuthor)
  .delete(protect, deleteAuthor);

module.exports = router;