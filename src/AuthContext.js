import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const savedState = localStorage.getItem('authState');
    return savedState ? JSON.parse(savedState) : { username: '' }; 
  });

  const updateAuthState = (newState) => {
    setAuthState(newState);
    localStorage.setItem('authState', JSON.stringify(newState));
  };

  const clearAuthState = () => {
    setAuthState({ username: '' }); 
    localStorage.removeItem('authState'); 
  };

  return (
    <AuthContext.Provider value={{ authState, updateAuthState, clearAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
