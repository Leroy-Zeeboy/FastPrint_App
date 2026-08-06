import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMesCommandes } from '../../api/commandeService';

export default function MesCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreStatut, setFiltreStatut] = useState('toutes');

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getMesCommandes();
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

  const filtres = [
    { valeur: 'toutes', label: 'Toutes' },
    { valeur: 'en_attente', label: 'En attente' },
    { valeur: 'en_cours', label: 'En cours' },
    { valeur: 'prete', label: 'Prêtes' },
    { valeur: 'refusee', label: 'Refusées' },
  ];

  const commandesFiltrees = filtreStatut === 'toutes'
    ? commandes
    : commandes.filter(c => c.statut === filtreStatut);

  // Trier par date de création décroissante (plus récentes en premier)
  const commandesTriees = [...commandesFiltrees].sort(
    (a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)
  );

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">
          Mes commandes
        </h1>
        <p className="text-gray-500 mt-1">
          Suivez l'état de vos documents déposés
        </p>
      </div>

      {/* Filtres par statut */}
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

      {/* Liste des commandes */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-secondary
                          border-t-transparent rounded-full animate-spin">
          </div>
        </div>
      ) : commandesTriees.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100
                        p-12 text-center">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-500 font-medium">
            {filtreStatut === 'toutes'
              ? 'Aucune commande pour l\'instant'
              : 'Aucune commande dans cette catégorie'}
          </p>
          {filtreStatut === 'toutes' && (
            <Link to="/client/deposer"
                  className="inline-block mt-4 bg-gradient-to-r from-primary
                             to-secondary text-white px-6 py-2.5 rounded-xl
                             text-sm font-semibold hover:opacity-90 transition">
              Déposer un document
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {commandesTriees.map((commande) => (
            <div key={commande.idCommande}
                 className="bg-white rounded-2xl shadow-sm border
                            border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary
                                  to-secondary rounded-xl flex items-center
                                  justify-center text-white text-lg font-bold
                                  flex-shrink-0">
                    📄
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">
                      {commande.nomFichier}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Déposé le{' '}
                      {new Date(commande.dateCreation).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium
                                  flex-shrink-0 ${getStatutStyle(commande.statut)}`}>
                  {getStatutLabel(commande.statut)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4
                              border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Pages</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {commande.nombrePages}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Type</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {commande.typeImpression === 'noir_et_blanc' ? 'N&B' : 'Couleur'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Disposition</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {commande.disposition === 'recto_simple' ? 'Recto' : 'R/V'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Montant</p>
                  <p className="font-bold text-secondary text-sm">
                    {commande.montantCalcule} FCFA
                  </p>
                </div>
              </div>

              {/* Motif de refus si applicable */}
              {commande.statut === 'refusee' && commande.motifRefus && (
                <div className="mt-4 bg-red-50 border border-red-200
                                text-red-700 rounded-xl px-4 py-3 text-sm">
                  <span className="font-semibold">Motif du refus : </span>
                  {commande.motifRefus}
                </div>
              )}

              {/* Message si prête */}
              {commande.statut === 'prete' && (
                <div className="mt-4 bg-green-50 border border-green-200
                                text-green-700 rounded-xl px-4 py-3 text-sm
                                flex items-center gap-2">
                  <span>✅</span>
                  <span>
                    Votre document est prêt à être récupéré
                    {commande.datePret && (
                      <> depuis le {new Date(commande.datePret).toLocaleDateString('fr-FR')}</>
                    )}
                  </span>
                </div>
              )}

              {/* Commentaire client */}
              {commande.commentaireClient && (
                <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3 text-sm
                                text-gray-600">
                  <span className="font-semibold text-gray-700">
                    Votre commentaire :{' '}
                  </span>
                  {commande.commentaireClient}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}