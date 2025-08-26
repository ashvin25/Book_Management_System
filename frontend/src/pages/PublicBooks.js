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
    return (
      <div className="main-content d-flex align-items-center justify-content-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container-fluid">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="text-center">
              {/* <h1 className="text-gradient display-4 fw-bold mb-3">
                <i className="fas fa-book-open me-3"></i>
                Books Catalog
              </h1> */}
              <p className="lead" style={{ color: "#efe7e5ff", font: "bold" }}>
                Discover our extensive collection of books from various authors
              </p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="row mb-4">
          <div className="col-md-8 mx-auto">
            <div className="card glass-effect">
              <div className="card-body p-4">
                <form onSubmit={handleSearch}>
                  <div className="input-group input-group-lg">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Search books by title, author, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit">
                      <i className="fas fa-search me-2"></i>
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {publicBooks.length === 0 ? (
          <div className="text-center py-5">
            <div className="card glass-effect">
              <div className="card-body py-5">
                <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
                <h3 className="text-muted">No books found</h3>
                <p className="text-muted">Try adjusting your search criteria</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="row">
              {publicBooks.map((book) => (
                <div key={book._id} className="col-xl-4 col-lg-6 col-md-6 mb-4">
                  <div className="card h-100 hover-lift transition-all">
                    {book.image && (
                      <img
                        src={`http://localhost:5000/${book.image}`}
                        className="card-img-top object-fit-cover"
                        alt={book.title}
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title fw-bold text-primary">
                        {book.title}
                      </h5>
                      <p className="card-text text-muted mb-2">
                        <i className="fas fa-user-pen me-2"></i>
                        <strong>Author:</strong> {book.authorId?.name || 'Unknown'}
                      </p>
                      <p className="card-text text-muted mb-2">
                        <i className="fas fa-calendar me-2"></i>
                        <strong>Published:</strong> {book.publishedYear}
                      </p>
                      <p className="card-text">
                        {book.description && book.description.length > 120
                          ? `${book.description.substring(0, 120)}...`
                          : book.description || 'No description available'}
                      </p>
                    </div>
                    <div className="card-footer bg-transparent border-0">
                      <small className="text-muted">
                        <i className="fas fa-eye me-1"></i>
                        Available for reading
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="row mt-5">
                <div className="col-12">
                  <nav className="d-flex justify-content-center">
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <i className="fas fa-chevron-left me-1"></i>
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
                          disabled={currentPage === pagination.totalPages}
                        >
                          Next
                          <i className="fas fa-chevron-right ms-1"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PublicBooks;
