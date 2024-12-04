/*
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import TransactionForm from './components/TransactionForm';
import Loader from './components/Loader';
import Signup from './components/Signup.js';
import ExistingUserLogin from './components/ExistingUserLogin.js';
import Dashboard from './components/Dashboard.js';
import MyListings from './components/MyListings.js';
import NewListing from './components/NewListing.js';
import ItemsSold from './components/ItemsSold'; // Import ItemsSold
import ItemsBought from './components/ItemsBought'; // Import ItemsBought

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [isLoadingAfterLogin, setIsLoadingAfterLogin] = useState(false);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (authToken) => {
    setIsLoadingAfterLogin(true);
    setToken(authToken);
    sessionStorage.setItem('token', authToken);

    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoadingAfterLogin(false);
    }, 2000);

    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    sessionStorage.removeItem('token');
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <div className="App">
      {isLoadingAfterLogin && <Loader />}
      {!isLoadingAfterLogin && (
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<ExistingUserLogin />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/mylistings"
            element={
              isAuthenticated ? <MyListings /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/newlisting"
            element={
              isAuthenticated ? <NewListing /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/items-sold"
            element={
              isAuthenticated ? <ItemsSold soldItems={[]} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/items-bought"
            element={
              isAuthenticated ? <ItemsBought boughtItems={[]} /> : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </div>
  );
}

export default App;

*/

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup.js';
import ExistingUserLogin from './components/ExistingUserLogin.js';
import Dashboard from './components/Dashboard.js';
import MyListings from './components/MyListings.js';
import NewListing from './components/NewListing.js';
import ItemsSold from './components/ItemsSold';
import ItemsBought from './components/ItemsBought';
import Loader from './components/Loader';

function App() {
  const navigate = useNavigate();
  const [isLoadingAfterLogin, setIsLoadingAfterLogin] = useState(false);

  const handleLogin = (authToken) => {
    setIsLoadingAfterLogin(true);
    sessionStorage.setItem('token', authToken); // Store mock token for dev

    setTimeout(() => {
      setIsLoadingAfterLogin(false);
      navigate('/signup'); // Redirect to Signup after login
    }, 2000);
  };

  const isUserLoggedIn = !!sessionStorage.getItem('token');

  return (
    <div className="App">
      {isLoadingAfterLogin && <Loader />}
      {!isLoadingAfterLogin && (
        <Routes>
          {/* Initial Route to Login */}
          <Route path="/" element={<Login onLogin={handleLogin} />} />

          {/* Public Pages */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<ExistingUserLogin onLogin={handleLogin} />} />

          {/* Protected Routes */}
          {isUserLoggedIn ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-listings" element={<MyListings />} />
              <Route path="/new-listing" element={<NewListing />} />
              <Route path="/items-sold" element={<ItemsSold soldItems={[]} />} />
              <Route path="/items-bought" element={<ItemsBought boughtItems={[]} />} />
            </>
          ) : (
            // Redirect to Login if unauthenticated
            <Route path="*" element={<Navigate to="/" replace />} />
          )}
        </Routes>
      )}
    </div>
  );
}

export default App;