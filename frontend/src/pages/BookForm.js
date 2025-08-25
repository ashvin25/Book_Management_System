import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createBook, updateBook, getBookById, reset, clearBook } from '../stores/slices/bookSlice';
import { getAuthors } from '../stores/slices/authorSlice';
import Spinner from '../components/Spinner';

const BookForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    publishedYear: '',
    authorId: '',
    image: null,
    existingImage: '',
  });

  const { title, description, publishedYear, authorId, image, existingImage } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { book, isLoading, isSuccess } = useSelector((state) => state.books);
  const { authors } = useSelector((state) => state.authors);

  const isEdit = Boolean(id);

  useEffect(() => {
    dispatch(getAuthors({ page: 1, limit: 1000 })); // Get all authors for dropdown
    
    if (isEdit) {
      dispatch(getBookById(id));
    } else {
      dispatch(clearBook());
      dispatch(reset());
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && book) {
      setFormData({
        title: book.title || '',
        description: book.description || '',
        publishedYear: book.publishedYear || '',
        authorId: book.authorId?._id || '',
        image: null,
        existingImage: book.image || '',
      });
    }
  }, [book, isEdit]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
      navigate('/admin/books');
    }
  }, [isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    if (e.target.name === 'image') {
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Debug: Check if required fields are populated
    console.log('Form data before submission:', {
      title,
      authorId,
      description,
      publishedYear,
      image: image ? 'File selected' : 'No file',
      existingImage
    });

    const bookData = new FormData();
    bookData.append('title', title);
    bookData.append('description', description);
    bookData.append('publishedYear', publishedYear);
    bookData.append('authorId', authorId);
    if (image) {
      bookData.append('image', image);
    }
    if (existingImage && !image) {
      bookData.append('existingImage', existingImage);
    }

    // Debug: Check FormData contents
    for (let [key, value] of bookData.entries()) {
      console.log(`${key}: ${value}`);
    }

    if (isEdit) {
      dispatch(updateBook({ id, bookData }));
    } else {
      dispatch(createBook(bookData));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mt-4">
      <h2>{isEdit ? 'Edit Book' : 'Add New Book'}</h2>
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={onSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title *
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={title}
                onChange={onChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="4"
                value={description}
                onChange={onChange}
              ></textarea>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="publishedYear" className="form-label">
                    Published Year
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="publishedYear"
                    name="publishedYear"
                    value={publishedYear}
                    onChange={onChange}
                    min="1000"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="authorId" className="form-label">
                    Author *
                  </label>
                  <select
                    className="form-select"
                    id="authorId"
                    name="authorId"
                    value={authorId}
                    onChange={onChange}
                    required
                  >
                    <option value="">Select Author</option>
                    {authors.map((author) => (
                      <option key={author._id} value={author._id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Cover Image
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                name="image"
                accept="image/*"
                onChange={onChange}
              />
              {existingImage && !image && (
                <div className="mt-2">
                  <img
                    src={`http://localhost:5000/${existingImage}`}
                    alt="Current cover"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </div>
              )}
            </div>
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                type="button"
                className="btn btn-secondary me-md-2"
                onClick={() => navigate('/admin/books')}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEdit ? 'Update Book' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookForm;