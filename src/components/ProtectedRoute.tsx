import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import type { JSX } from 'react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = supabase.auth.getUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;