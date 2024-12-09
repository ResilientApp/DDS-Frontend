import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Signup.css'; // Reuse styles
import axios from 'axios';
import useNavigationHelpers from '../functions';
import ResVaultSDK from 'resvault-sdk';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import the AuthContext hook

const NewListing = () => {
  const { goToMyListings, logout } = useNavigationHelpers();
  const { authState } = useAuth(); // Access the current auth state for the username
  const [itemTitle, setItemTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minBidValue, setMinBidValue] = useState('');
  const [file, setFile] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null); // For displaying success or error messages
  const sdkRef = useRef(new ResVaultSDK());
  const location = useLocation(); // Access the current route location

  const submitForm = async (e) => {
    e.preventDefault();

    const recipient = 'DpVsFmC7d5e39MgRkPmfVPR8npJ3RRsRPZhRDzrK7DCm';

    const jsonData = {
      projectName: 'ResAuc',
      transactionType: 'New Listing',
      title: itemTitle,
      description: description,
      minBidValue: parseInt(minBidValue),
    };

    const showFeedback = (message, variant) => {
      setFeedbackMessage({ message, type: variant });
      setTimeout(() => setFeedbackMessage(null), 5000); // Remove message after 5 seconds
    };

    try {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const imageBase64 = reader.result.split(',')[1];
          const jsonDataCopy = JSON.parse(JSON.stringify(jsonData));
          jsonDataCopy.imageBase64 = imageBase64;
          jsonDataCopy.username = authState.username;

          // Send listing to backend
          const response = await axios.post('https://resauc.resilientdb.com/api/new-listing', JSON.stringify(jsonDataCopy), {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          // Handle the response from the backend
          console.log(response.data); // Success message from the backend
          showFeedback('Listing created successfully!', 'success');

          // Post transaction to ResVaultSDK
          await sdkRef.current?.sendMessage({
            type: 'commit',
            direction: 'commit',
            amount: '1',
            data: jsonData,
            recipient,
          });

          console.log('Transaction posted successfully!', jsonData);
          showFeedback('Transaction posted successfully!', 'success');
          clearFields(); // Clear input fields, including the image file
        };
        reader.readAsDataURL(file);
      } else {
        // Send listing to backend
        const response = await axios.post('https://resauc.resilientdb.com/api/new-listing', jsonData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Handle the response from the backend
        console.log(response.data); // Success message from the backend
        showFeedback('Listing created successfully!', 'success');

        // Post transaction to ResVaultSDK
        await sdkRef.current?.sendMessage({
          type: 'commit',
          direction: 'commit',
          amount: '1',
          data: jsonData, // Serialize listing data
          recipient, // Recipient address
        });

        console.log('Transaction posted successfully!', jsonData);
        showFeedback('Transaction posted successfully!', 'success');
        clearFields(); // Clear input fields, including the image file
      }
    } catch (error) {
      console.error('Error creating listing or posting transaction:', error);
      showFeedback('Error creating listing. Please try again.', 'error');
    }
  };



  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const clearFields = () => {
    setItemTitle('');
    setDescription('');
    setMinBidValue('');
    setFile(null); // Clear the file input
    document.getElementById('fileUpload').value = ''; // Reset the file input field visually
  };

  const handleLogout = () => {
    logout();
  };

  const isActiveLink = (path) => location.pathname === path;

  return (
    <div>
      <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: '#1a1a40' }}>
        <div className="container">
          <NavLink className="navbar-brand text-light" to="/dashboard" style={{ fontWeight: 'bold', fontSize: '24px' }}>
            ResAuc
          </NavLink>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink className="nav-link text-light" to="/my-listings" activeClassName="active-link">
                  My Listings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-light" to="/new-listing" activeClassName="active-link">
                  New Listing
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-light" to="/items-sold" activeClassName="active-link">
                  Items Sold
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-light" to="/items-bought" activeClassName="active-link">
                  Items Bought
                </NavLink>
              </li>
            </ul>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mt-4 signup-form">
        <h2>Create New Listing</h2>
        <form onSubmit={() => { }}>
          <div className="form-group">
            <label htmlFor="itemTitle" className="form-label">
              Item Title
            </label>
            <input
              type="text"
              className="form-control input-field"
              id="itemTitle"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              placeholder="Enter the title of your item"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control input-field"
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the item"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="minBidValue" className="form-label">
              Minimum Bid Value
            </label>
            <input
              type="number"
              className="form-control input-field"
              id="minBidValue"
              value={minBidValue}
              onChange={(e) => setMinBidValue(e.target.value)}
              placeholder="Set the minimum bid value (in USD)"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fileUpload" className="form-label">
              Upload Image
            </label>
            <input type="file" className="form-control" id="fileUpload" onChange={handleFileChange} />
          </div>
          {feedbackMessage && (
            <div
              className={`feedback-message ${feedbackMessage.type === 'success' ? 'success' : 'error'
                }`}
            >
              {feedbackMessage.message}
            </div>
          )}
          <div className="button-group">
            <button type="submit" className="submit-btn" onClick={submitForm}>
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewListing;
