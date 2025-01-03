import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const role = sessionStorage.getItem('role'); // Ensure role is set in sessionStorage during login

  if (role !== 'ADMIN') {
    alert('Unauthorized access. Redirecting to login.');
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
