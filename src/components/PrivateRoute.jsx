import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const  PrivateRoute=({ children, roles }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Redirect to login and save current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect unauthorized users to a safe page (e.g., home)
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;