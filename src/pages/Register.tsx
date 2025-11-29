
import React from 'react';
import { Navigate } from 'react-router-dom';

const Register: React.FC = () => {
  // Redirect to auth/register
  return <Navigate to="/auth/register" replace />;
};

export default Register;
