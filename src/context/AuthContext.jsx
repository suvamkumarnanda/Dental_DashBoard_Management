import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider=({ children }) =>{
  const [user, setUser] = useState(null);

  // Load user details from localStorage 
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('signedInUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse stored user', error);
      localStorage.removeItem('signedInUser'); 
    }
  }, []);

 
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