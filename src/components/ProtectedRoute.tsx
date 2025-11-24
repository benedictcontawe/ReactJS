import { Navigate } from 'react-router-dom';
import { onAuthStateChange } from '../utils/auth';
import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import type { User } from 'firebase/auth';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {    
    const unsubscribe = onAuthStateChange((currentUser) => {// Listen to auth state changes
      setUser(currentUser);
      setLoading(false);
    });    
    return () => unsubscribe();// Cleanup subscription on unmount
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;