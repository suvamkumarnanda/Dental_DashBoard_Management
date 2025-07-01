import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider=({ children }) =>{
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('loggedInUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse stored user', error);
      localStorage.removeItem('loggedInUser'); 
    }
  }, []);

  // Login function expects a user object with role and other info
  const login = (userData) => {
    if (!userData || !userData.role) {
      console.warn('login called without valid userData or role');
      return;
    }
    setUser(userData);
    localStorage.setItem('loggedInUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedInUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;