// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { getAuthors, deleteAuthor, createAuthor } from '../stores/slices/authorSlice';
// import Spinner from '../components/Spinner';

// // Material-UI imports
// import {
//   Modal,
//   Box,
//   TextField,
//   Button,
//   Typography,
//   IconButton
// } from '@mui/material';
// import { Close, Add } from '@mui/icons-material';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

// const Authors = () => {
//   const dispatch = useDispatch();
//   const { authors, isLoading, pagination } = useSelector((state) => state.authors);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [modalOpen, setModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     bio: '',
//     dob: null
//   });

//   useEffect(() => {
//     dispatch(getAuthors({ page: currentPage, limit: 10, search: searchTerm }));
//   }, [dispatch, currentPage, searchTerm]);

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this author?')) {
//       dispatch(deleteAuthor(id));
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1);
//     dispatch(getAuthors({ page: 1, limit: 10, search: searchTerm }));
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleOpenModal = () => {
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setFormData({
//       name: '',
//       bio: '',
//       dob: null
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleDateChange = (date) => {
//     setFormData(prev => ({
//       ...prev,
//       dob: date
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     const authorData = {
//       name: formData.name,
//       bio: formData.bio,
//       dob: formData.dob ? formData.dob.toISOString() : ''
//     };

//     dispatch(createAuthor(authorData));
//     handleCloseModal();
//   };

//   if (isLoading) {
//     return <Spinner />;
//   }

//   // Modal style
//   const modalStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 500,
//     maxWidth: '90%',
//     bgcolor: 'background.paper',
//     boxShadow: 24,
//     p: 4,
//     borderRadius: 2,
//     maxHeight: '90vh',
//     overflowY: 'auto'
//   };

//   return (
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2>Authors Management</h2>
//         {/* CHANGED: Replaced Link with button that opens modal */}
//         <button 
//           className="btn btn-primary"
//           onClick={handleOpenModal}
//         >
//           <Add className="me-2" />
//           Add New Author
//         </button>
//       </div>

//       {/* Search Form */}
//       <div className="row mb-4">
//         <div className="col-md-6">
//           <form onSubmit={handleSearch}>
//             <div className="input-group">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search authors by name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <button className="btn btn-outline-secondary" type="submit">
//                 Search
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Authors Table */}
//       <div className="card">
//         <div className="card-body">
//           {authors.length === 0 ? (
//             <p className="text-center">No authors found.</p>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-striped">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Bio</th>
//                     <th>Date of Birth</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {authors.map((author) => (
//                     <tr key={author._id}>
//                       <td>{author.name}</td>
//                       <td>
//                         {author.bio && author.bio.length > 50
//                           ? `${author.bio.substring(0, 50)}...`
//                           : author.bio}
//                       </td>
//                       <td>
//                         {author.dob
//                           ? new Date(author.dob).toLocaleDateString()
//                           : 'N/A'}
//                       </td>
//                       <td>
//                         <Link
//                           to={`/admin/authors/edit/${author._id}`}
//                           className="btn btn-sm btn-outline-primary me-2"
//                         >
//                           Edit
//                         </Link>
//                         <button
//                           onClick={() => handleDelete(author._id)}
//                           className="btn btn-sm btn-outline-danger"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Pagination */}
//           {pagination.totalPages > 1 && (
//             <nav className="d-flex justify-content-center mt-4">
//               <ul className="pagination">
//                 <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                   <button
//                     className="page-link"
//                     onClick={() => handlePageChange(currentPage - 1)}
//                   >
//                     Previous
//                   </button>
//                 </li>
//                 {[...Array(pagination.totalPages)].map((_, index) => (
//                   <li
//                     key={index}
//                     className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
//                   >
//                     <button
//                       className="page-link"
//                       onClick={() => handlePageChange(index + 1)}
//                     >
//                       {index + 1}
//                     </button>
//                   </li>
//                 ))}
//                 <li
//                   className={`page-item ${
//                     currentPage === pagination.totalPages ? 'disabled' : ''
//                   }`}
//                 >
//                   <button
//                     className="page-link"
//                     onClick={() => handlePageChange(currentPage + 1)}
//                   >
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//           )}
//         </div>
//       </div>

//       {/* ADDED: Modal for adding new author */}
//       <Modal
//         open={modalOpen}
//         onClose={handleCloseModal}
//         aria-labelledby="add-author-modal"
//         aria-describedby="add-new-author-form"
//       >
//         <Box sx={modalStyle}>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <Typography variant="h5" component="h2">
//               Add New Author
//             </Typography>
//             <IconButton onClick={handleCloseModal} size="small">
//               <Close />
//             </IconButton>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label="Author Name"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               required
//               margin="normal"
//             />

//             <TextField
//               fullWidth
//               label="Biography"
//               name="bio"
//               value={formData.bio}
//               onChange={handleInputChange}
//               multiline
//               rows={4}
//               margin="normal"
//             />

//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <DatePicker
//                 label="Date of Birth"
//                 value={formData.dob}
//                 onChange={handleDateChange}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     fullWidth
//                     margin="normal"
//                   />
//                 )}
//               />
//             </LocalizationProvider>

//             <div className="d-flex justify-content-end mt-3">
//               <Button 
//                 variant="outlined" 
//                 onClick={handleCloseModal} 
//                 sx={{ mr: 2 }}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 variant="contained" 
//                 type="submit"
//               >
//                 Add Author
//               </Button>
//             </div>
//           </form>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default Authors;


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
  TablePagination
} from '@mui/material';
import { Close, Add, Search, Edit, Delete } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const Authors = () => {
  const dispatch = useDispatch();
  const { authors, isLoading, pagination, isSuccess, author } = useSelector((state) => state.authors);
  const [currentPage, setCurrentPage] = useState(0); // Material-UI uses 0-based indexing
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
        // Refresh the authors list after successful deletion
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

  // Set form data when author data is loaded for editing
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
    setCurrentPage(0); // Reset to first page when searching
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
    setCurrentPage(0); // Reset to first page when changing page size
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
      // Refresh the authors list after successful creation
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
      // Refresh the authors list after successful update
      dispatch(getAuthors({ page: currentPage + 1, limit: rowsPerPage, search: searchTerm }));
    } catch (error) {
      console.error('Failed to update author:', error);
      alert(error.message || 'Failed to update author. Please try again.');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  // Modal style
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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Authors Management</h2>
        <button 
          className="btn btn-primary"
          onClick={handleOpenAddModal}
        >
          <Add className="me-2" />
          Add New Author
        </button>
      </div>

      {/* Enhanced Toolbar with Search */}
      <Paper sx={{ mb: 2 }}>
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          <form onSubmit={handleSearch} style={{ width: '30%' }}>
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

      {/* Enhanced Authors Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Bio</strong></TableCell>
                <TableCell><strong>Date of Birth</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No authors found.
                  </TableCell>
                </TableRow>
              ) : (
                authors.map((author) => (
                  <TableRow key={author._id} hover>
                    <TableCell>{author.name}</TableCell>
                    <TableCell>
                      {author.bio && author.bio.length > 50
                        ? `${author.bio.substring(0, 50)}...`
                        : author.bio}
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
    </div>
  );
};

export default Authors;