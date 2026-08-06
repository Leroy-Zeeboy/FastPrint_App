import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { inscription } from '../../api/authService';
import { useAuth } from '../../context/AuthContext';

export default function Inscription() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: '',
  });
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
      const res = await inscription(form);
      const { token, role, nom, prenom, email } = res.data.data;
      login({ nom, prenom, email, role }, token);
      navigate('/client');
    } catch (err) {
      setErreur(err.response?.data?.message || 'Inscription impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary
                    to-secondary flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary
                            rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xl">FP</span>
            </div>
            <span className="text-xl font-black text-primary">
              Fast<span className="text-secondary">Print</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">
            Créer un compte
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Rejoignez FastPrint gratuitement
          </p>
        </div>

        {/* Erreur */}
        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-700
                          rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
            <span>⚠️</span> {erreur}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                required
                placeholder="Leroy"
                className="w-full border border-gray-200 rounded-xl px-4 py-3
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-secondary focus:border-transparent
                           bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                required
                placeholder="Djaowe"
                className="w-full border border-gray-200 rounded-xl px-4 py-3
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-secondary focus:border-transparent
                           bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-secondary focus:border-transparent bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Téléphone <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <input
              type="tel"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              placeholder="699 000 000"
              className="w-full border border-gray-200 rounded-xl px-4 py-3
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-secondary focus:border-transparent bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              name="motDePasse"
              value={form.motDePasse}
              onChange={handleChange}
              required
              placeholder="Au moins 6 caractères"
              className="w-full border border-gray-200 rounded-xl px-4 py-3
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-secondary focus:border-transparent bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary
                       text-white rounded-xl py-3.5 font-bold hover:opacity-90
                       transition shadow-md disabled:opacity-60
                       disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent
                                 rounded-full animate-spin"></span>
                Inscription...
              </span>
            ) : (
              'Créer mon compte →'
            )}
          </button>
        </form>

        {/* Lien connexion */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link to="/connexion"
                className="text-secondary font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};