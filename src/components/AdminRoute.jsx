import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

   

  if (!user) {
    console.log("No user found and redirecting to login")
    return <Navigate to="/login" replace />;
  }
if (user.role !== 'admin') {
  
    return <div className="p-6 text-center text-red-600 font-semibold">Admins can only access</div>;
  }
  return children;
};

export default AdminRoute;
