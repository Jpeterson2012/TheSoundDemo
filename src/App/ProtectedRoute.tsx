// src/ProtectedRoute.js
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: any) => {
  const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("loggedIn") !== null);

  useEffect(() => {}, [loggedIn]);

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
