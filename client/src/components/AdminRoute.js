// src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (user === null) {
    // Handle the case when the user data is not yet loaded
    return null; // or a loading spinner or message
  }

  // Check if the user has the admin role
  if (user && user.role === 'Admin') {
    return children;
  } else {
    // Redirect to the homepage or a not-authorized page if not an admin
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;
