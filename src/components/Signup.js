import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', message: '' });

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://35.202.159.88:3000/register', {
        username,
        password,
      });

      setFeedbackMessage({ type: 'success', message: response.data }); // Success message
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } catch (error) {
      if (error.response) {
        setFeedbackMessage({ type: 'error', message: error.response.data });
      } else {
        console.error(error);
        setFeedbackMessage({ type: 'error', message: 'An error occurred. Please try again.' });
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="nav-links">
        <span
          className="nav-link active"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </span>
        <span
          className="nav-link"
          onClick={() => navigate('/login')}
        >
          Log In
        </span>
      </div>
      <div className="signup-form">
        <h2 className="text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="form-animate">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control user-id-input"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="btn btn-primary submit-btn">
              Sign Up
            </button>
          </div>
        </form>
        {feedbackMessage.message && (
          <div className={`feedback-message ${feedbackMessage.type}`}>
            {feedbackMessage.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
