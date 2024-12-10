
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