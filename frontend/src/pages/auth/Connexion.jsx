import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connexion } from '../../api/authService';
import { useAuth } from '../../context/AuthContext';

export default function Connexion() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', motDePasse: '' });
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setLoading(true);

    try {
      const res = await connexion(form);
      const { token, role, nom, prenom, email } = res.data.data;

      // Sauvegarder la session
      login({ nom, prenom, email, role }, token);

      // Rediriger selon le rôle
      if (role === 'administrateur') navigate('/admin');
      else if (role === 'gerant') navigate('/gerant');
      else navigate('/client');

    } catch (err) {
      setErreur(err.response?.data?.message || 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

        {/* Logo + titre */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center
                          justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">FP</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">FastPrint</h1>
          <p className="text-gray-500 text-sm mt-1">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Message d'erreur */}
        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-700
                          rounded-lg px-4 py-3 mb-6 text-sm">
            {erreur}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-secondary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              name="motDePasse"
              value={form.motDePasse}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-3
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-secondary focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-lg py-3 font-semibold
                       hover:bg-secondary transition-colors disabled:opacity-60
                       disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Lien inscription */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-secondary font-medium hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}