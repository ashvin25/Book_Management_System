import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthors, deleteAuthor, createAuthor, updateAuthor, getAuthorById } from '../stores/slices/authorSlice';
import Spinner from '../components/Spinner';

// Material-UI imports
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const Authors = () => {
  const dispatch = useDispatch();
  const { authors, isLoading, pagination, isSuccess, author } = useSelector((state) => state.authors);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    dob: null
  });
  const [editingAuthorId, setEditingAuthorId] = useState(null);

  useEffect(() => {
    dispatch(getAuthors({ page: currentPage + 1, limit: rowsPerPage, search: searchTerm }));
  }, [dispatch, currentPage, rowsPerPage, searchTerm, isSuccess]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        await dispatch(deleteAuthor(id)).unwrap();
        dispatch(getAuthors({ page: currentPage + 1, limit: rowsPerPage, search: searchTerm }));
      } catch (error) {
        console.error('Failed to delete author:', error);
        alert(error.message || 'Failed to delete author. Please try again.');
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      setEditingAuthorId(id);
      await dispatch(getAuthorById(id)).unwrap();
      setEditModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch author details:', error);
      alert('Failed to load author details. Please try again.');
    }
  };

  useEffect(() => {
    if (author && editingAuthorId) {
      setFormData({
        name: author.name || '',
        bio: author.bio || '',
        dob: author.dob ? new Date(author.dob) : null
      });
    }
  }, [author, editingAuthorId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    dispatch(getAuthors({ page: 1, limit: rowsPerPage, search: searchTerm }));
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
      name: '',
      bio: '',
      dob: null
    });
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingAuthorId(null);
    setFormData({
      name: '',
      bio: '',
      dob: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dob: date
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    const authorData = {
      name: formData.name,
      bio: formData.bio,
      dob: formData.dob ? formData.dob.toISOString() : ''
    };

    try {
      await dispatch(createAuthor(authorData)).unwrap();
      handleCloseAddModal();
      dispatch(getAuthors({ page: currentPage + 1, limit: rowsPerPage, search: searchTerm }));
    } catch (error) {
      console.error('Failed to create author:', error);
      alert(error.message || 'Failed to create author. Please try again.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const authorData = {
      name: formData.name,
      bio: formData.bio,
      dob: formData.dob ? formData.dob.toISOString() : ''
    };

    try {
      await dispatch(updateAuthor({ id: editingAuthorId, authorData })).unwrap();
      handleCloseEditModal();
      dispatch(getAuthors({ page: currentPage + 1, limit: rowsPerPage, search: searchTerm }));
    } catch (error) {
      console.error('Failed to update author:', error);
      alert(error.message || 'Failed to update author. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="main-content d-flex align-items-center justify-content-center">
        <Spinner />
      </div>
    );
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
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-6 fw-bold mb-1" style={{ color: "#d9d7d7ff" }}>
                  {/* <i className="fas fa-user-pen me-2"></i> */}
                  Authors Management
                </h1>
                {/* <p className="text-muted fw-bold"  style={{ color: "#d9d7d7ff" }}>Manage your authors and their biographies</p> */}
              </div>
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
                Add New Author
              </Button>
            </div>
          </div>
        </div>

        {/* Search Toolbar */}
        <Paper sx={{ mb: 3, p: 2 }} className="glass-effect">
          <Toolbar>
            <form onSubmit={handleSearch} style={{ width: '100%' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search authors by name..."
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
                          dispatch(getAuthors({ page: 1, limit: rowsPerPage, search: '' }));
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

        {/* Authors Table */}
        <Paper className="glass-effect">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(0, 123, 255, 0.1)' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Bio</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Date of Birth</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {authors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <div className="text-center">
                        <i className="fas fa-user-slash fa-3x text-muted mb-3"></i>
                        <Typography variant="h6" color="textSecondary">
                          No authors found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {searchTerm ? 'Try adjusting your search criteria' : 'Add your first author to get started'}
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  authors.map((author) => (
                    <TableRow key={author._id} hover sx={{ '&:hover': { backgroundColor: 'rgba(0, 123, 255, 0.02)' } }}>
                      <TableCell sx={{ fontWeight: 'medium', fontSize: '1rem' }}>{author.name}</TableCell>
                      <TableCell>
                        {author.bio && author.bio.length > 50
                          ? `${author.bio.substring(0, 50)}...`
                          : author.bio || 'No biography'}
                      </TableCell>
                      <TableCell>
                        {author.dob
                          ? new Date(author.dob).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(author._id)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(author._id)}
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

          {/* Pagination */}
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

        {/* Add Author Modal */}
        <Modal
          open={addModalOpen}
          onClose={handleCloseAddModal}
          aria-labelledby="add-author-modal"
          aria-describedby="add-new-author-form"
        >
          <Box sx={modalStyle}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Typography variant="h5" component="h2">
                Add New Author
              </Typography>
              <IconButton onClick={handleCloseAddModal} size="small">
                <Close />
              </IconButton>
            </div>

            <form onSubmit={handleAddSubmit}>
              <TextField
                fullWidth
                label="Author Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                label="Biography"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                multiline
                rows={4}
                margin="normal"
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dob}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
              </LocalizationProvider>

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
                  Add Author
                </Button>
              </div>
            </form>
          </Box>
        </Modal>

        {/* Edit Author Modal */}
        <Modal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          aria-labelledby="edit-author-modal"
          aria-describedby="edit-author-form"
        >
          <Box sx={modalStyle}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Typography variant="h5" component="h2">
                Edit Author
              </Typography>
              <IconButton onClick={handleCloseEditModal} size="small">
                <Close />
              </IconButton>
            </div>

            <form onSubmit={handleEditSubmit}>
              <TextField
                fullWidth
                label="Author Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                label="Biography"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                multiline
                rows={4}
                margin="normal"
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dob}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
              </LocalizationProvider>

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
                  Update Author
                </Button>
              </div>
            </form>
          </Box>
        </Modal>
      </Container>
    </div>
  );
};

export default Authors;
