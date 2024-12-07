import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import useNavigationHelpers from '../functions';
import { useAuth } from '../AuthContext'; 
import './ItemsStyles.css'; 

const ItemsSold = () => {
  const { logout } = useNavigationHelpers();
  const { authState } = useAuth(); 
  const [soldItems, setSoldItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => logout();

  const handleSendReceipt = (itemId) => {
    console.log(`Sending receipt for item ID: ${itemId}`);
  };

  // Fetch sold items from the backend
  useEffect(() => {
    const fetchSoldItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/sold-by-me', {
          headers: { 'Content-Type': 'application/json' },
          params: { username: authState.username }, 
        });

        // Process the response to calculate `soldFor` as the highest bid value
        const updatedSoldItems = response.data.map(item => {
          // Extract highest bid value from the bids array
          const highestBid = item.bids.reduce(
            (max, bid) => (bid.bidValue > max ? bid.bidValue : max),
            item.minBidValue 
          );

          return {
            ...item,
            soldFor: `$${highestBid.toFixed(2)}`, 
          };
        });

        setSoldItems(updatedSoldItems);
      } catch (err) {
        console.error('Error fetching sold items:', err);
        setError('Failed to fetch sold items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSoldItems();
  }, [authState.username]);

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

      {/* Main content */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Items Sold</h2>

        {loading ? (
          <p className="text-center">Loading sold items...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : soldItems.length === 0 ? (
          <p className="text-center">No items sold yet.</p>
        ) : (
          <div className="row">
            {soldItems.map((item) => (
              <div className="col-md-4 mb-4" key={item._id}>
                <Card className="card-hover shadow-sm">
                  <Card.Img
                    style={{
                      width: '100%',
                      height: '250px', 
                      objectFit: 'cover', 
                      objectPosition: 'center', 
                    }} variant="top" src={item.image ? `data:image/jpeg;base64,${item.image}` : 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'} />
                  <Card.Body>
                    <Card.Title className="card-title">{item.title}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <Card.Subtitle className="card-subtitle mb-2">Sold For: {item.soldFor}</Card.Subtitle>

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

export default ItemsSold;
