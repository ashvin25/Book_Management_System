import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './stores/stores';
import Header from './components/Header';
import NavigationSidebar from './components/NavigationSidebar';
import PrivateRoute from './components/PrivateRoute';
import PublicBooks from './pages/PublicBooks';
import Login from './pages/Login';
import Authors from './pages/Authors';
import AuthorForm from './pages/AuthorForm';
import Books from './pages/Books';
import BookForm from './pages/BookForm';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <NavigationSidebar />
          <Header />
          <main className="main-content fade-in">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicBooks />} />
              
              {/* Admin Auth Routes */}
              <Route path="/admin/login" element={<Login />} />
              
              {/* Admin Protected Routes */}
              <Route
                path="/admin/authors"
                element={
                  <PrivateRoute>
                    <Authors />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/authors/create"
                element={
                  <PrivateRoute>
                    <AuthorForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/authors/edit/:id"
                element={
                  <PrivateRoute>
                    <AuthorForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/books"
                element={
                  <PrivateRoute>
                    <Books />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/books/create"
                element={
                  <PrivateRoute>
                    <BookForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/books/edit/:id"
                element={
                  <PrivateRoute>
                    <BookForm />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
