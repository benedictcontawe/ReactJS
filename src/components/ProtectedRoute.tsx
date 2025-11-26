import { Navigate } from 'react-router-dom';
import { getCurrentUser, type User } from '../utils/auth';
import { useEffect, useState, type ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      console.log('[ProtectedRoute] Current user:', currentUser);
      setUser(currentUser);
      setLoading(false);
    }).catch((error) => {
      console.error('[ProtectedRoute] Error getting user:', error);
      setUser(null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('[ProtectedRoute] No user, redirecting to login');
    return <Navigate to="/login" replace={ true } />;
  }

  return children;
};

export default ProtectedRoute;