import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createAuthor, updateAuthor, getAuthorById, reset, clearAuthor } from '../stores/slices/authorSlice';
import Spinner from '../components/Spinner';

const AuthorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    dob: '',
  });

  const { name, bio, dob } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { author, isLoading, isSuccess } = useSelector((state) => state.authors);

  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      dispatch(getAuthorById(id));
    } else {
      dispatch(clearAuthor());
      dispatch(reset());
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && author) {
      setFormData({
        name: author.name || '',
        bio: author.bio || '',
        dob: author.dob ? author.dob.split('T')[0] : '',
      });
    }
  }, [author, isEdit]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
      navigate('/admin/authors');
    }
  }, [isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const authorData = {
      name,
      bio,
      dob,
    };

    if (isEdit) {
      dispatch(updateAuthor({ id, authorData }));
    } else {
      dispatch(createAuthor(authorData));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mt-4">
      <h2>{isEdit ? 'Edit Author' : 'Add New Author'}</h2>
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name *
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="bio" className="form-label">
                Biography
              </label>
              <textarea
                className="form-control"
                id="bio"
                name="bio"
                rows="4"
                value={bio}
                onChange={onChange}
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label htmlFor="dob" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                className="form-control"
                id="dob"
                name="dob"
                value={dob}
                onChange={onChange}
              />
            </div>
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                type="button"
                className="btn btn-secondary me-md-2"
                onClick={() => navigate('/admin/authors')}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEdit ? 'Update Author' : 'Add Author'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthorForm;
