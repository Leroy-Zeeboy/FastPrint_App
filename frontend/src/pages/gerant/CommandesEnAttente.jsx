import { useEffect, useState } from 'react';
import { getCommandesEnAttente, traiterCommande } from '../../api/commandeService';
import { getUrlTelechargement } from '../../api/documentService';

export default function CommandesEnAttente() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commandeActive, setCommandeActive] = useState(null); // pour la modale de refus
  const [motifRefus, setMotifRefus] = useState('');
  const [enCours, setEnCours] = useState(null); // id de la commande en traitement
  const [telechargementEnCours, setTelechargementEnCours] = useState(null); // id du document

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

  useEffect(() => {
    charger();
  }, []);

  const handleValider = async (idCommande) => {
    setEnCours(idCommande);
    try {
      await traiterCommande(idCommande, { statut: 'prete' });
      setCommandes(prev => prev.filter(c => c.idCommande !== idCommande));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur lors de la validation.');
    } finally {
      setEnCours(null);
    }
  };

  const ouvrirRefus = (commande) => {
    setCommandeActive(commande);
    setMotifRefus('');
  };

  const confirmerRefus = async () => {
    if (!commandeActive) return;
    setEnCours(commandeActive.idCommande);
    try {
      await traiterCommande(commandeActive.idCommande, {
        statut: 'refusee',
        motifRefus: motifRefus || 'Non conforme',
      });
      setCommandes(prev =>
        prev.filter(c => c.idCommande !== commandeActive.idCommande)
      );
      setCommandeActive(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur lors du refus.');
    } finally {
      setEnCours(null);
    }
  };

  const handleTelecharger = async (idDocument) => {
    setTelechargementEnCours(idDocument);
    try {
      const res = await getUrlTelechargement(idDocument);
      const url = res.data.data;
      // Ouvre le fichier Cloudinary dans un nouvel onglet (téléchargement direct)
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur lors du téléchargement.');
    } finally {
      setTelechargementEnCours(null);
    }
  };

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">
          Commandes en attente
        </h1>
        <p className="text-gray-500 mt-1">
          Validez ou refusez les documents déposés par les clients
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-secondary
                          border-t-transparent rounded-full animate-spin">
          </div>
        </div>
      ) : commandes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100
                        p-12 text-center">
          <p className="text-5xl mb-4">✅</p>
          <p className="text-gray-500 font-medium">
            Aucune commande en attente
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Tout est à jour, bon travail !
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {commandes.map((commande) => (
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
                <span className="text-xs px-3 py-1.5 rounded-full font-medium
                                 bg-yellow-100 text-yellow-700 flex-shrink-0">
                  En attente
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4
                              border-t border-gray-100 mb-4">
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

              {commande.commentaireClient && (
                <div className="mb-4 bg-gray-50 rounded-xl px-4 py-3 text-sm
                                text-gray-600">
                  <span className="font-semibold text-gray-700">
                    Commentaire du client :{' '}
                  </span>
                  {commande.commentaireClient}
                </div>
              )}

              {/* Bouton de téléchargement du document */}
              <button
                onClick={() => handleTelecharger(commande.idDocument)}
                disabled={telechargementEnCours === commande.idDocument}
                className="w-full mb-3 bg-blue-50 border-2 border-blue-200
                           text-blue-700 rounded-xl py-3 font-semibold
                           hover:bg-blue-100 transition disabled:opacity-60"
              >
                {telechargementEnCours === commande.idDocument
                  ? 'Ouverture...'
                  : '📥 Télécharger le document'}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => handleValider(commande.idCommande)}
                  disabled={enCours === commande.idCommande}
                  className="flex-1 bg-gradient-to-r from-green-400 to-green-600
                             text-white rounded-xl py-3 font-semibold
                             hover:opacity-90 transition disabled:opacity-60"
                >
                  {enCours === commande.idCommande ? '...' : '✅ Valider (prête)'}
                </button>
                <button
                  onClick={() => ouvrirRefus(commande)}
                  disabled={enCours === commande.idCommande}
                  className="flex-1 bg-white border-2 border-red-200 text-red-600
                             rounded-xl py-3 font-semibold hover:bg-red-50
                             transition disabled:opacity-60"
                >
                  ❌ Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale de refus */}
      {commandeActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setCommandeActive(null)}
          ></div>

          <div className="relative bg-white rounded-2xl shadow-xl w-full
                          max-w-md p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-1">
              Refuser la commande
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              "{commandeActive.nomFichier}"
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motif du refus
            </label>
            <textarea
              value={motifRefus}
              onChange={(e) => setMotifRefus(e.target.value)}
              rows={3}
              placeholder="Ex : Fichier illisible, format non supporté..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-secondary resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setCommandeActive(null)}
                className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-3
                           font-semibold hover:bg-gray-200 transition"
              >
                Annuler
              </button>
              <button
                onClick={confirmerRefus}
                disabled={enCours === commandeActive.idCommande}
                className="flex-1 bg-red-500 text-white rounded-xl py-3
                           font-semibold hover:bg-red-600 transition
                           disabled:opacity-60"
              >
                {enCours === commandeActive.idCommande
                  ? '...'
                  : 'Confirmer le refus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}