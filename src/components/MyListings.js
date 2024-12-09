import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Toast } from 'react-bootstrap';
import useNavigationHelpers from '../functions';
import ResVaultSDK from 'resvault-sdk';
import { NavLink } from 'react-router-dom';
import './Dashboard.css';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const MyListings = () => {
  const { goToNewListing, logout } = useNavigationHelpers();
  const sdkRef = useRef(new ResVaultSDK());
  const { authState } = useAuth();
  const [myListingsData, setMyListingsData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Success message for general actions
  const [sellErrorMessage, setSellErrorMessage] = useState(''); // Error message specific to selling
  const [showToast, setShowToast] = useState(false); // State to control the toast visibility
  const [toastVariant, setToastVariant] = useState('success'); // Controls the color of the toast

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('https://resauc.resilientdb.com/api/my-listings', {
          params: { username: authState.username },
        });
        if (response.data) {
          setMyListingsData(response.data);
        }
      } catch (error) {
        setErrorMessage('Error fetching listings, please try again later.');
      }
    };

    if (authState.username) {
      fetchListings();
    }
  }, [authState.username]);

  const handleLogout = () => logout();

  const handleDeleteListing = async (listingId, title) => {
    try {
      const response = await axios.delete('https://resauc.resilientdb.com/api/delete-listing', {
        data: { username: authState.username, listingId },
      });

      if (response.status === 200) {
        setMyListingsData(myListingsData.filter((listing) => listing._id !== listingId));
        setSuccessMessage(`Listing "${title}" deleted successfully!`);
        setToastVariant('success');
        setShowToast(true);

        const transactionData = {
          projectName: 'ResAuc',
          transactionType: 'Delete Listing',
          title,
        };

        sdkRef.current?.sendMessage({
          type: 'commit',
          direction: 'commit',
          amount: '1',
          data: transactionData,
          recipient: 'DpVsFmC7d5e39MgRkPmfVPR8npJ3RRsRPZhRDzrK7DCm',
        });
      }
    } catch (error) {
      setErrorMessage('Error deleting the listing, please try again later.');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleSellItem = async (listingId, title, minBidValue) => {
    try {
      const response = await axios.post('https://resauc.resilientdb.com/api/sell-item', {
        sellerUsername: authState.username,
        listingId,
      });

      if (response.status === 200) {
        setMyListingsData(myListingsData.map((listing) =>
          listing._id === listingId ? { ...listing, sold: true } : listing
        ));

        const transactionData = {
          projectName: 'ResAuc',
          transactionType: 'Sell Item',
          title,
          soldPrice: response.data.soldPrice,
        };

        sdkRef.current?.sendMessage({
          type: 'commit',
          direction: 'commit',
          amount: '1',
          data: transactionData,
          recipient: 'DpVsFmC7d5e39MgRkPmfVPR8npJ3RRsRPZhRDzrK7DCm',
        });

        setSuccessMessage(`Item "${title}" sold successfully for $${response.data.soldPrice}!`);
        setToastVariant('success');
        setShowToast(true);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error === 'No bid placed') {
        setSellErrorMessage('Error: No bid has been placed yet. Cannot sell item.');
      } else {
        setSellErrorMessage('Error: No bid has been placed yet. Cannot sell item.');
      }
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  return (
    <div>
      {/* Navbar */}
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
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Toast Notifications */}
      {showToast && (
        <div className="toast-container position-fixed top-0 end-0 p-3">
          <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
            <Toast.Body className={`text-white ${toastVariant === 'success' ? 'bg-success' : 'bg-danger'}`}>
              {successMessage || sellErrorMessage || errorMessage}
            </Toast.Body>
          </Toast>
        </div>
      )}

      {/* Main content */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">My Listings</h2>
        {myListingsData.length === 0 ? (
          <div className="text-center">No listings found.</div>
        ) : (
          <div className="row">
            {myListingsData.map((listing) => (
              <div className="col-md-4 mb-4" key={listing._id}>
                <Card className="card-hover shadow-sm">
                  <Card.Img
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                    variant="top"
                    src={listing.image ? `data:image/jpeg;base64,${listing.image}` : 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                  />
                  <Card.Body>
                    <Card.Title className="card-title">{listing.title}</Card.Title>
                    <Card.Text>{listing.description}</Card.Text>
                    <Card.Subtitle className="card-subtitle minimum-bid mb-2">
                      Minimum Bid Value: ${listing.minBidValue}
                    </Card.Subtitle>
                    <Card.Subtitle className="card-subtitle mb-2">Existing Bids:</Card.Subtitle>
                    <ul className="text-muted">
                      {Array.isArray(listing.bids) && listing.bids.map((bid, index) => (
                        <li key={index}>
                          Bid Value: ${bid.bidValue}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="success"
                      onClick={() => handleSellItem(listing._id, listing.title, listing.minBidValue)}
                      className="me-2 btn-gradient"
                      disabled={listing.sold}
                    >
                      {listing.sold ? 'Sold' : 'Sell Item'}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteListing(listing._id, listing.title)}
                      className="btn-danger btn-gradient"
                      disabled={listing.sold}
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
