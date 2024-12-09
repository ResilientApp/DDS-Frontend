import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const savedState = localStorage.getItem('authState');
    return savedState ? JSON.parse(savedState) : { username: '' }; // Default to no username
  });

  const updateAuthState = (newState) => {
    setAuthState(newState);
    localStorage.setItem('authState', JSON.stringify(newState));
  };

  const clearAuthState = () => {
    setAuthState({ username: '' }); // Reset to default state
    localStorage.removeItem('authState'); // Clear from localStorage
  };

  return (
    <AuthContext.Provider value={{ authState, updateAuthState, clearAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier access
export const useAuth = () => {
  return useContext(AuthContext);
};
