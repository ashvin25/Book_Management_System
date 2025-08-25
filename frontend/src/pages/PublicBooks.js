import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicBooks } from '../stores/slices/bookSlice';
import Spinner from '../components/Spinner';

const PublicBooks = () => {
  const dispatch = useDispatch();
  const { publicBooks, isLoading, pagination } = useSelector((state) => state.books);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getPublicBooks({ page: currentPage, limit: 9, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(getPublicBooks({ page: 1, limit: 9, search: searchTerm }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Books Catalog</h2>
      
      {/* Search Form */}
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search books by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Books Grid */}
      {publicBooks.length === 0 ? (
        <div className="text-center">
          <p>No books found.</p>
        </div>
      ) : (
        <>
          <div className="row">
            {publicBooks.map((book) => (
              <div key={book._id} className="col-md-4 mb-4">
                <div className="card h-100">
                  {book.image && (
                    <img
                      src={`http://localhost:5000/${book.image}`}
                      className="card-img-top"
                      alt={book.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text">
                      <strong>Author:</strong> {book.authorId?.name}
                    </p>
                    <p className="card-text">
                      <strong>Published Year:</strong> {book.publishedYear}
                    </p>
                    <p className="card-text">
                      {book.description && book.description.length > 100
                        ? `${book.description.substring(0, 100)}...`
                        : book.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === pagination.totalPages ? 'disabled' : ''
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default PublicBooks;