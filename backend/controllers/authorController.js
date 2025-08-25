const Author = require('../models/Author');

// @desc    Get all authors with pagination and filtering
// @route   GET /api/authors
// @access  Private
const getAuthors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = search ? { name: { $regex: search, $options: 'i' } } : {};

    const authors = await Author.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Author.countDocuments(query);

    res.json({
      authors,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAuthors: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single author
// @route   GET /api/authors/:id
// @access  Private
const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (author) {
      res.json(author);
    } else {
      res.status(404).json({ message: 'Author not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a author
// @route   POST /api/authors
// @access  Private
const createAuthor = async (req, res) => {
  try {
    const { name, bio, dob } = req.body;

    const author = new Author({
      name,
      bio,
      dob
    });

    const createdAuthor = await author.save();
    res.status(201).json(createdAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a author
// @route   PUT /api/authors/:id
// @access  Private
const updateAuthor = async (req, res) => {
  try {
    const { name, bio, dob } = req.body;

    const author = await Author.findById(req.params.id);

    if (author) {
      author.name = name || author.name;
      author.bio = bio || author.bio;
      author.dob = dob || author.dob;

      const updatedAuthor = await author.save();
      res.json(updatedAuthor);
    } else {
      res.status(404).json({ message: 'Author not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const Book = require('../models/Book');

// @desc    Delete a author
// @route   DELETE /api/authors/:id
// @access  Private
const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (author) {
      // Check if there are any books associated with this author
      const booksCount = await Book.countDocuments({ authorId: req.params.id });
      
      if (booksCount > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete author. There are books associated with this author.' 
        });
      }

      await Author.findByIdAndDelete(req.params.id);
      res.json({ message: 'Author removed' });
    } else {
      res.status(404).json({ message: 'Author not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};