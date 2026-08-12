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
  const [voirMotDePasse, setVoirMotDePasse] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary to-secondary flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-2">
            <img 
              src="/LogoFP.png" 
              alt="Logo FastPrint" 
              className="h-20 sm:h-24 w-auto max-w-[220px] mx-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/180x50/0052FF/FFFFFF?text=FastPrint';
              }}
            />
          </Link>
          <h1 className="text-2xl font-black text-gray-900 mt-2">
            Créer un compte
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Rejoignez FastPrint gratuitement
          </p>
        </div>

        {/* Erreur */}
        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
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
                placeholder="votre prénom"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50"
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
                placeholder="votre nom"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50"
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
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50"
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
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={voirMotDePasse ? 'text' : 'password'}
                name="motDePasse"
                value={form.motDePasse}
                onChange={handleChange}
                required
                placeholder="Au moins 6 caractères"
                className="w-full border border-gray-200 rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setVoirMotDePasse(!voirMotDePasse)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg p-1"
                title={voirMotDePasse ? "Masquer" : "Afficher"}
              >
                {voirMotDePasse ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-3.5 font-bold hover:opacity-90 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Inscription...
              </span>
            ) : (
              'Créer mon compte →'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link to="/connexion" className="text-secondary font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}