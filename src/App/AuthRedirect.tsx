// src/RedirectIfAuth.js
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AuthRedirect = ({ children }: any) => {
  const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("loggedIn") !== null);

  useEffect(() => {}, [loggedIn]);

  if (loggedIn) {    
    return <Navigate to="/app" replace />;
  }

  return children;
};

export default AuthRedirect;
