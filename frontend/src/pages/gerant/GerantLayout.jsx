import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function GerantLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuMobile, setMenuMobile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const liens = [
    { path: '/gerant', label: 'Tableau de bord', emoji: '🏠' },
    { path: '/gerant/commandes', label: 'Commandes en attente', emoji: '📋' },
    { path: '/gerant/historique', label: 'Historique', emoji: '🗂️' },
    { path: '/gerant/commandes-articles', label: 'Commandes d\'articles', emoji: '🧾' },
    { path: '/gerant/accessoires', label: 'Accessoires', emoji: '🛍️' },
  ];

  const isActive = (path) => {
    if (path === '/gerant') return location.pathname === '/gerant';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r
                        border-gray-100 fixed h-full shadow-sm">

        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary
                            rounded-xl flex items-center justify-center">
              <span className="text-white font-black">FP</span>
            </div>
            <span className="font-black text-primary text-lg">
              Fast<span className="text-secondary">Print</span>
            </span>
          </Link>
        </div>

        {/* Profil */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary
                            rounded-full flex items-center justify-center
                            text-white font-bold text-sm flex-shrink-0">
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {user?.prenom} {user?.nom}
              </p>
              <p className="text-xs text-gray-400 truncate">Gérant</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {liens.map((lien) => (
            <Link
              key={lien.path}
              to={lien.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl
                          text-sm font-medium transition-all ${
                isActive(lien.path)
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{lien.emoji}</span>
              <span className="flex-1">{lien.label}</span>
            </Link>
          ))}
        </nav>

        {/* Déconnexion */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                       text-sm font-medium text-red-500 hover:bg-red-50
                       transition-colors"
          >
            <span>🚪</span>
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* NAVBAR MOBILE */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white
                      border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary
                            rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">FP</span>
            </div>
            <span className="font-black text-primary">FastPrint</span>
          </Link>
          <button onClick={() => setMenuMobile(!menuMobile)}
                  className="text-gray-600 text-xl">
            {menuMobile ? '✕' : '☰'}
          </button>
        </div>

        {menuMobile && (
          <div className="bg-white border-t border-gray-100 px-4 py-3 space-y-1">
            {liens.map((lien) => (
              <Link
                key={lien.path}
                to={lien.path}
                onClick={() => setMenuMobile(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                            font-medium ${
                  isActive(lien.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-600'
                }`}
              >
                <span>{lien.emoji}</span>
                <span>{lien.label}</span>
              </Link>
            ))}
            <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3
                               text-red-500 text-sm font-medium">
              <span>🚪</span> Se déconnecter
            </button>
          </div>
        )}
      </div>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
}