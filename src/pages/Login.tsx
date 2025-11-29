
import React from 'react';
import { Navigate } from 'react-router-dom';

const Login: React.FC = () => {
  // Redirect to root
  return <Navigate to="/" replace />;
};

export default Login;
