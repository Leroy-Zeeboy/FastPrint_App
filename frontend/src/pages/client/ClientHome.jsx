import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMesCommandes } from '../../api/commandeService';
import { getCompteurNonLues } from '../../api/notificationService';

export default function ClientHome() {
  const { user } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [compteurNotif, setCompteurNotif] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const [resCommandes, resNotif] = await Promise.all([
          getMesCommandes(),
          getCompteurNonLues(),
        ]);
        setCommandes(resCommandes.data.data || []);
        setCompteurNotif(resNotif.data.data || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  const getStatutStyle = (statut) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-700';
      case 'en_cours': return 'bg-blue-100 text-blue-700';
      case 'prete': return 'bg-green-100 text-green-700';
      case 'refusee': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'en_attente': return 'En attente';
      case 'en_cours': return 'En cours';
      case 'prete': return '✅ Prête';
      case 'refusee': return '❌ Refusée';
      default: return statut;
    }
  };

  const commandesRecentes = commandes.slice(0, 3);
  const commandesEnAttente = commandes.filter(c => c.statut === 'en_attente').length;
  const commandesPrêtes = commandes.filter(c => c.statut === 'prete').length;

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">
          Bonjour, {user?.prenom} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Bienvenue sur votre espace FastPrint
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl
                        p-6 text-white shadow-md">
          <p className="text-blue-100 text-sm mb-1">Total commandes</p>
          <p className="text-4xl font-black">{commandes.length}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-orange-500
                        rounded-2xl p-6 text-white shadow-md">
          <p className="text-yellow-100 text-sm mb-1">En attente</p>
          <p className="text-4xl font-black">{commandesEnAttente}</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-600
                        rounded-2xl p-6 text-white shadow-md relative">
          <p className="text-green-100 text-sm mb-1">Notifications</p>
          <p className="text-4xl font-black">{compteurNotif}</p>
          {compteurNotif > 0 && (
            <span className="absolute top-4 right-4 w-3 h-3 bg-white
                             rounded-full animate-ping"></span>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link to="/client/deposer"
              className="bg-white border-2 border-dashed border-secondary
                         rounded-2xl p-6 hover:bg-blue-50 transition group
                         flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary
                          rounded-2xl flex items-center justify-center text-2xl
                          shadow-md group-hover:scale-110 transition">
            📄
          </div>
          <div>
            <p className="font-bold text-gray-900">Déposer un document</p>
            <p className="text-gray-500 text-sm">
              Imprimer un cours, rapport ou document
            </p>
          </div>
        </Link>

        <Link to="/client/boutique"
              className="bg-white border-2 border-dashed border-accent
                         rounded-2xl p-6 hover:bg-orange-50 transition group
                         flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-accent to-orange-500
                          rounded-2xl flex items-center justify-center text-2xl
                          shadow-md group-hover:scale-110 transition">
            🛒
          </div>
          <div>
            <p className="font-bold text-gray-900">Boutique fournitures</p>
            <p className="text-gray-500 text-sm">
              Stylos, cahiers et autres fournitures
            </p>
          </div>
        </Link>
      </div>

      {/* Commandes récentes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-gray-900">Commandes récentes</h2>
          <Link to="/client/commandes"
                className="text-secondary text-sm font-medium hover:underline">
            Voir tout →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-secondary
                            border-t-transparent rounded-full animate-spin">
            </div>
          </div>
        ) : commandesRecentes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 font-medium">
              Aucune commande pour l'instant
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Déposez votre premier document pour commencer
            </p>
            <Link to="/client/deposer"
                  className="inline-block mt-4 bg-gradient-to-r from-primary
                             to-secondary text-white px-6 py-2.5 rounded-xl
                             text-sm font-semibold hover:opacity-90 transition">
              Déposer un document
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {commandesRecentes.map((commande) => (
              <div key={commande.idCommande}
                   className="flex items-center gap-4 p-4 bg-gray-50
                              rounded-xl hover:bg-gray-100 transition">
                <div className="w-10 h-10 bg-gradient-to-br from-primary
                                to-secondary rounded-xl flex items-center
                                justify-center text-white text-sm font-bold
                                flex-shrink-0">
                  📄
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {commande.nomFichier}
                  </p>
                  <p className="text-xs text-gray-400">
                    {commande.montantCalcule} FCFA •{' '}
                    {commande.nombrePages} pages
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium
                                  flex-shrink-0 ${getStatutStyle(commande.statut)}`}>
                  {getStatutLabel(commande.statut)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}