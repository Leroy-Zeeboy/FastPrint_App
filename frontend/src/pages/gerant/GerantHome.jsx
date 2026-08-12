import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCommandesEnAttente } from '../../api/commandeService';

export default function GerantHome() {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getCommandesEnAttente();
        setCommandes(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  const commandesRecentes = commandes.slice(0, 5);

  return (
    <div>
      {/* En-tête sans image à droite */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">
          Bonjour, {user?.prenom} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Vue d'ensemble de l'activité
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white shadow-md sm:col-span-1">
          <p className="text-blue-100 text-sm mb-1">Commandes en attente</p>
          <p className="text-4xl font-black">{commandes.length}</p>
        </div>

        <Link to="/gerant/commandes" className="bg-white border-2 border-dashed border-secondary rounded-2xl p-6 hover:bg-blue-50 transition group flex items-center gap-4 sm:col-span-1">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition">
            📋
          </div>
          <div>
            <p className="font-bold text-gray-900">Traiter les commandes</p>
            <p className="text-gray-500 text-sm">
              Valider ou refuser les documents
            </p>
          </div>
        </Link>

        <Link to="/gerant/accessoires" className="bg-white border-2 border-dashed border-accent rounded-2xl p-6 hover:bg-orange-50 transition group flex items-center gap-4 sm:col-span-1">
          <div className="w-14 h-14 bg-gradient-to-br from-accent to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition">
            🛍️
          </div>
          <div>
            <p className="font-bold text-gray-900">Gérer les accessoires</p>
            <p className="text-gray-500 text-sm">
              Publier ou modifier le catalogue
            </p>
          </div>
        </Link>
      </div>

      {/* Commandes récentes en attente */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-gray-900">Dernières commandes en attente</h2>
          <Link to="/gerant/commandes" className="text-secondary text-sm font-medium hover:underline">
            Voir tout →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : commandesRecentes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-gray-500 font-medium">
              Aucune commande en attente
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Tout est traité, bravo !
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {commandesRecentes.map((commande) => (
              <Link
                key={commande.idCommande}
                to="/gerant/commandes"
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  📄
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {commande.nomFichier}
                  </p>
                  <p className="text-xs text-gray-400">
                    {commande.montantCalcule} FCFA • {commande.nombrePages} pages
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-medium bg-yellow-100 text-yellow-700 flex-shrink-0">
                  En attente
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}