import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import './index.css';
import App from './App';
import { AuthProvider } from './AuthContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <BrowserRouter> {/* Ensure routing is available */}
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
