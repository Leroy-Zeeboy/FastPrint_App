import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute, RoleRoute } from './routes/ProtectedRoute';
import Home from './pages/Home';
import Connexion from './pages/auth/Connexion';
import Inscription from './pages/auth/Inscription';
import ClientDashboard from './pages/client/ClientDashboard';
import GerantDashboard from './pages/gerant/GerantDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/connexion';
    if (user.role === 'administrateur') return '/admin';
    if (user.role === 'gerant') return '/gerant';
    return '/client';
  };

  return (
    <Routes>
      {/* Page d'accueil publique */}
      <Route path="/" element={<Home />} />

      {/* Routes publiques */}
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/inscription" element={<Inscription />} />

      {/* Routes client */}
      <Route path="/client/*" element={
        <ProtectedRoute>
          <ClientDashboard />
        </ProtectedRoute>
      } />

      {/* Routes gérant */}
      <Route path="/gerant/*" element={
        <RoleRoute roles={['gerant', 'administrateur']}>
          <GerantDashboard />
        </RoleRoute>
      } />

      {/* Routes admin */}
      <Route path="/admin/*" element={
        <RoleRoute roles={['administrateur']}>
          <AdminDashboard />
        </RoleRoute>
      } />

      {/* Route inconnue → dashboard selon rôle */}
      <Route path="*" element={<Navigate to={getDashboardLink()} />} />
    </Routes>
  );
}

export default App;