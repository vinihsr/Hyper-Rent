import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

export default function RouteWrapper({ children, isPrivate = false, adminOnly = false }) {
  const { signed, loading, isAdmin } = useContext(AuthContext);

  if (loading) return null;

  if (isPrivate && !signed) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && signed && !isAdmin) {
    return <Navigate to="/fleet" replace />;
  }

if (!isPrivate && signed) {
  return <Navigate to={isAdmin ? "/admin" : "/fleet"} replace />;
}
  return children;
}