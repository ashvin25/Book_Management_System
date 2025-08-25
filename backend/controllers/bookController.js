const Book = require('../models/Book');
const Author = require('../models/Author');

// @desc    Get all books with pagination and filtering
// @route   GET /api/books
// @access  Public for public route, Private for admin
const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = search ? { title: { $regex: search, $options: 'i' } } : {};

    const books = await Book.find(query)
      .populate('authorId', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(query);

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public for public route, Private for admin
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('authorId', 'name bio dob');

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  try {
    const { title, description, publishedYear, authorId } = req.body;
    const image = req.file ? req.file.path : '';

    const book = new Book({
      title,
      description,
      image,
      publishedYear,
      authorId
    });

    const createdBook = await book.save();
    // Populate author details
    await createdBook.populate('authorId', 'name');
    res.status(201).json(createdBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  try {
    const { title, description, publishedYear, authorId } = req.body;
    const image = req.file ? req.file.path : req.body.existingImage;

    const book = await Book.findById(req.params.id);

    if (book) {
      book.title = title || book.title;
      book.description = description || book.description;
      book.publishedYear = publishedYear || book.publishedYear;
      book.authorId = authorId || book.authorId;
      book.image = image || book.image;

      const updatedBook = await book.save();
      // Populate author details
      await updatedBook.populate('authorId', 'name');
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      await Book.findByIdAndDelete(req.params.id);
      res.json({ message: 'Book removed' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};