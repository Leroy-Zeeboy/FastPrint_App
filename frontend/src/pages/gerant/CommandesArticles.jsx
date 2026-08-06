import { useEffect, useState } from 'react';
import {
  getToutesLesCommandesAccessoires,
  traiterCommandeAccessoire,
} from '../../api/commandeAccessoireService';

export default function CommandesArticles() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('en_attente');
  const [enCours, setEnCours] = useState(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getToutesLesCommandesAccessoires();
        setCommandes(res.data.data || []);
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
      case 'prete': return 'bg-green-100 text-green-700';
      case 'recuperee': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'en_attente': return 'En attente';
      case 'prete': return '✅ Prête';
      case 'recuperee': return '📦 Récupérée';
      default: return statut;
    }
  };

  const handleTraiter = async (idCommande, nouveauStatut) => {
    setEnCours(idCommande);
    try {
      await traiterCommandeAccessoire(idCommande, nouveauStatut);
      const res = await getToutesLesCommandesAccessoires();
      setCommandes(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur lors du traitement.');
    } finally {
      setEnCours(null);
    }
  };

  const filtres = [
    { valeur: 'en_attente', label: 'En attente' },
    { valeur: 'prete', label: 'Prêtes' },
    { valeur: 'recuperee', label: 'Récupérées' },
    { valeur: 'toutes', label: 'Toutes' },
  ];

  const commandesFiltrees = filtreStatut === 'toutes'
    ? commandes
    : commandes.filter(c => c.statut === filtreStatut);

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">
          Commandes d'articles
        </h1>
        <p className="text-gray-500 mt-1">
          Suivez et traitez les commandes de fournitures des clients
        </p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filtres.map((filtre) => (
          <button
            key={filtre.valeur}
            onClick={() => setFiltreStatut(filtre.valeur)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filtreStatut === filtre.valeur
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {filtre.label}
            {filtre.valeur !== 'toutes' && (
              <span className="ml-1.5 opacity-70">
                ({commandes.filter(c => c.statut === filtre.valeur).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-secondary
                          border-t-transparent rounded-full animate-spin">
          </div>
        </div>
      ) : commandesFiltrees.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100
                        p-12 text-center">
          <p className="text-5xl mb-4">🛍️</p>
          <p className="text-gray-500 font-medium">
            Aucune commande dans cette catégorie
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {commandesFiltrees.map((commande) => (
            <div key={commande.idCommandeAccessoire}
                 className="bg-white rounded-2xl shadow-sm border
                            border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-bold text-gray-900">
                    {commande.clientPrenom} {commande.clientNom}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {commande.clientTelephone && `${commande.clientTelephone} • `}
                    Commandé le{' '}
                    {new Date(commande.dateCreation).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium
                                  flex-shrink-0 ${getStatutStyle(commande.statut)}`}>
                  {getStatutLabel(commande.statut)}
                </span>
              </div>

              {/* Lignes de la commande */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-4">
                {commande.lignes.map((ligne) => (
                  <div key={ligne.idLigneCommande}
                       className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {ligne.quantite} × {ligne.nomAccessoire}
                    </span>
                    <span className="font-medium text-gray-900">
                      {ligne.sousTotal} FCFA
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-black text-secondary text-lg">
                  {commande.montantTotal} FCFA
                </span>

                {commande.statut === 'en_attente' && (
                  <button
                    onClick={() => handleTraiter(commande.idCommandeAccessoire, 'prete')}
                    disabled={enCours === commande.idCommandeAccessoire}
                    className="bg-gradient-to-r from-green-400 to-green-600
                               text-white rounded-xl px-5 py-2.5 text-sm
                               font-semibold hover:opacity-90 transition
                               disabled:opacity-60"
                  >
                    {enCours === commande.idCommandeAccessoire
                      ? '...'
                      : '✅ Marquer prête'}
                  </button>
                )}

                {commande.statut === 'prete' && (
                  <button
                    onClick={() => handleTraiter(commande.idCommandeAccessoire, 'recuperee')}
                    disabled={enCours === commande.idCommandeAccessoire}
                    className="bg-gray-800 text-white rounded-xl px-5 py-2.5
                               text-sm font-semibold hover:opacity-90 transition
                               disabled:opacity-60"
                  >
                    {enCours === commande.idCommandeAccessoire
                      ? '...'
                      : '📦 Marquer récupérée'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}