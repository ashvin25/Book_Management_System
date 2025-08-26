import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBooks, deleteBook, createBook, updateBook, getBookById } from '../stores/slices/bookSlice';
import { getAuthors } from '../stores/slices/authorSlice';
import Spinner from '../components/Spinner';

// Material-UI imports
import {
  Modal,
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Toolbar,
  InputAdornment,
  TablePagination,
  Container
} from '@mui/material';
import { Close, Add, Search, Edit, Delete } from '@mui/icons-material';

const Books = () => {
  const dispatch = useDispatch();
  const { books, isLoading, pagination, isSuccess, book } = useSelector((state) => state.books);
  const { authors } = useSelector((state) => state.authors);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    publishedYear: '',
    authorId: '',
    image: null,
    existingImage: ''
  });
  const [editingBookId, setEditingBookId] = useState(null);

  useEffect(() => {
    dispatch(getBooks({ page: currentPage + 1, limit: rowsPerPage, search: searchTerm }));
    dispatch(getAuthors({ page: 1, limit: 1000 }));
  }, [dispatch, currentPage, rowsPerPage, searchTerm, isSuccess]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await dispatch(deleteBook(id)).unwrap();
        dispatch(getBooks({ page: currentPage + 1, limit: rowsPerPage, search: searchTerm }));
      } catch (error) {
        console.error('Failed to delete book:', error);
        alert(error.message || 'Failed to delete book. Please try again.');
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      setEditingBookId(id);
      await dispatch(getBookById(id)).unwrap();
      setEditModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch book details:', error);
      alert('Failed to load book details. Please try again.');
    }
  };

  useEffect(() => {
    if (book && editingBookId) {
      setFormData({
        title: book.title || '',
        description: book.description || '',
        publishedYear: book.publishedYear || '',
        authorId: book.authorId?._id || '',
        image: null,
        existingImage: book.image || ''
      });
    }
  }, [book, editingBookId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    dispatch(getBooks({ page: 1, limit: rowsPerPage, search: searchTerm }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setFormData({
      title: '',
      description: '',
      publishedYear: '',
      authorId: '',
      image: null,
      existingImage: ''
    });
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingBookId(null);
    setFormData({
      title: '',
      description: '',
      publishedYear: '',
      authorId: '',
      image: null,
      existingImage: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    const bookData = new FormData();
    bookData.append('title', formData.title);
    bookData.append('description', formData.description);
    bookData.append('publishedYear', formData.publishedYear);
    bookData.append('authorId', formData.authorId);
    if (formData.image) {
      bookData.append('image', formData.image);
    }

    try {
      await dispatch(createBook(bookData)).unwrap();
      handleCloseAddModal();
      dispatch(getBooks({ page: currentPage + 1, limit: rowsPerPage, search: searchTerm }));
    } catch (error) {
      console.error('Failed to create book:', error);
      alert(error.message || 'Failed to create book. Please try again.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const bookData = new FormData();
    bookData.append('title', formData.title);
    bookData.append('description', formData.description);
    bookData.append('publishedYear', formData.publishedYear);
    bookData.append('authorId', formData.authorId);
    if (formData.image) {
      bookData.append('image', formData.image);
    }
    if (formData.existingImage && !formData.image) {
      bookData.append('existingImage', formData.existingImage);
    }

    try {
      await dispatch(updateBook({ id: editingBookId, bookData })).unwrap();
      handleCloseEditModal();
      dispatch(getBooks({ page: currentPage + 1, limit: rowsPerPage, search: searchTerm }));
    } catch (error) {
      console.error('Failed to update book:', error);
      alert(error.message || 'Failed to update book. Please try again.');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxWidth: '90%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  return (
    <div className="main-content">
      <Container maxWidth="xl">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className=""  style={{ color: "#d9d7d7ff" }}>Books Management</h2>
           {/* <p className="text-muted fw-bold"  style={{ color: "#d9d7d7ff" }}>Manage your books and their details</p> */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddModal}
            sx={{
              background: 'linear-gradient(135deg, var(--primary-color), #0056b3)',
              borderRadius: '25px',
              padding: '12px 24px',
              fontWeight: 600
            }}
          >
            Add New Book
          </Button>
        </div>

        {/* Enhanced Toolbar with Search */}
        <Paper sx={{ mb: 3 }} className="glass-effect">
          <Toolbar>
            <form onSubmit={handleSearch} style={{ width: '100%' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search books by title..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSearchTerm('');
                          setCurrentPage(0);
                          dispatch(getBooks({ page: 1, limit: rowsPerPage, search: '' }));
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </form>
          </Toolbar>
        </Paper>

        {/* Enhanced Books Table */}
        <Paper className="glass-effect">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Cover</strong></TableCell>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Author</strong></TableCell>
                  <TableCell><strong>Published Year</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No books found.
                    </TableCell>
                  </TableRow>
                ) : (
                  books.map((book) => (
                    <TableRow key={book._id} hover>
                      <TableCell>
                        {book.image && (
                          <img
                            src={`http://localhost:5000/${book.image}`}
                            alt={book.title}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.authorId?.name}</TableCell>
                      <TableCell>{book.publishedYear}</TableCell>
                      <TableCell>
                        {book.description && book.description.length > 50
                          ? `${book.description.substring(0, 50)}...`
                          : book.description}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(book._id)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(book._id)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Enhanced Material-UI Pagination with Page Size Dropdown */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={pagination.totalItems || 0}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
            }
          />
        </Paper>

        {/* Add Book Modal */}
        <Modal
          open={addModalOpen}
          onClose={handleCloseAddModal}
          aria-labelledby="add-book-modal"
          aria-describedby="add-new-book-form"
        >
          <Box sx={modalStyle}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Typography variant="h5" component="h2">
                Add New Book
              </Typography>
              <IconButton onClick={handleCloseAddModal} size="small">
                <Close />
              </IconButton>
            </div>

            <form onSubmit={handleAddSubmit}>
              <TextField
                fullWidth
                label="Book Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Published Year"
                name="publishedYear"
                type="number"
                value={formData.publishedYear}
                onChange={handleInputChange}
                inputProps={{ 
                  min: 1000, 
                  max: new Date().getFullYear() 
                }}
                margin="normal"
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Author</InputLabel>
                <Select
                  name="authorId"
                  value={formData.authorId}
                  onChange={handleInputChange}
                  label="Author"
                >
                  <MenuItem value="">
                    <em>Select Author</em>
                  </MenuItem>
                  {authors.map((author) => (
                    <MenuItem key={author._id} value={author._id}>
                      {author.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="book-image-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="book-image-upload">
                  <Button variant="outlined" component="span" fullWidth>
                    {formData.image ? 'Change Cover Image' : 'Upload Cover Image'}
                  </Button>
                </label>
                {formData.image && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected: {formData.image.name}
                  </Typography>
                )}
              </FormControl>

              <div className="d-flex justify-content-end mt-3">
                <Button 
                  variant="outlined" 
                  onClick={handleCloseAddModal} 
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  type="submit"
                >
                  Add Book
                </Button>
              </div>
            </form>
          </Box>
        </Modal>

        {/* Edit Book Modal */}
        <Modal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          aria-labelledby="edit-book-modal"
          aria-describedby="edit-book-form"
        >
          <Box sx={modalStyle}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Typography variant="h5" component="h2">
                Edit Book
              </Typography>
              <IconButton onClick={handleCloseEditModal} size="small">
                <Close />
              </IconButton>
            </div>

            <form onSubmit={handleEditSubmit}>
              <TextField
                fullWidth
                label="Book Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Published Year"
                name="publishedYear"
                type="number"
                value={formData.publishedYear}
                onChange={handleInputChange}
                inputProps={{ 
                  min: 1000, 
                  max: new Date().getFullYear() 
                }}
                margin="normal"
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Author</InputLabel>
                <Select
                  name="authorId"
                  value={formData.authorId}
                  onChange={handleInputChange}
                  label="Author"
                >
                  <MenuItem value="">
                    <em>Select Author</em>
                  </MenuItem>
                  {authors.map((author) => (
                    <MenuItem key={author._id} value={author._id}>
                      {author.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="edit-book-image-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="edit-book-image-upload">
                  <Button variant="outlined" component="span" fullWidth>
                    {formData.image ? 'Change Cover Image' : 'Upload Cover Image'}
                  </Button>
                </label>
                {formData.existingImage && !formData.image && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Current: {formData.existingImage.split('/').pop()}
                  </Typography>
                )}
                {formData.image && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected: {formData.image.name}
                  </Typography>
                )}
              </FormControl>

              <div className="d-flex justify-content-end mt-3">
                <Button 
                  variant="outlined" 
                  onClick={handleCloseEditModal} 
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  type="submit"
                >
                  Update Book
                </Button>
              </div>
            </form>
          </Box>
        </Modal>
      </Container>
    </div>
  );
};

export default Books;
