import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


// Route accessible uniquement si connecté
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;
  if (!user) return <Navigate to="/connexion" />;

  return children;
};

// Route accessible uniquement pour un rôle spécifique
export const RoleRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;
  if (!user) return <Navigate to="/connexion" />;
  if (!roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};