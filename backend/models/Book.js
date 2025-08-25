const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  publishedYear: {
    type: Number
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);