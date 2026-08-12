import { useEffect, useState } from 'react';
import { getCatalogue } from '../../api/accessoireService';
import {
  getMonPanier,
  ajouterAuPanier,
  supprimerDuPanier,
  viderPanier,
  validerPanier,
} from '../../api/panierService';

const BASE_FICHIERS = `http://${window.location.hostname}:8080`;

export default function Boutique() {
  const [catalogue, setCatalogue] = useState([]);
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [enCours, setEnCours] = useState(null); // id accessoire en cours d'ajout
  const [erreur, setErreur] = useState('');
  const [succesValidation, setSuccesValidation] = useState(false);
  const [validationEnCours, setValidationEnCours] = useState(false);
  const [videEnCours, setVideEnCours] = useState(false);

  useEffect(() => {
    const charger = async () => {
      try {
        const [resCatalogue, resPanier] = await Promise.allSettled([
          getCatalogue(),
          getMonPanier(),
        ]);
        if (resCatalogue.status === 'fulfilled') {
          setCatalogue(resCatalogue.value.data.data || []);
        }
        if (resPanier.status === 'fulfilled') {
          setPanier(resPanier.value.data.data || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  const handleAjouter = async (idAccessoire) => {
    setErreur('');
    setEnCours(idAccessoire);
    try {
      const res = await ajouterAuPanier({ idAccessoire, quantite: 1 });
      setPanier(res.data.data);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Impossible d\'ajouter cet article.');
    } finally {
      setEnCours(null);
    }
  };

  const handleSupprimer = async (idLigne) => {
    try {
      await supprimerDuPanier(idLigne);
      const res = await getMonPanier();
      setPanier(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViderPanier = async () => {
    if (!confirm('Vider complètement le panier ?')) return;
    setVideEnCours(true);
    try {
      await viderPanier();
      const res = await getMonPanier();
      setPanier(res.data.data);
    } catch (err) {
      console.error(err);
      setErreur(err.response?.data?.message || 'Impossible de vider le panier.');
    } finally {
      setVideEnCours(false);
    }
  };

  const handleValider = async () => {
    setErreur('');
    setValidationEnCours(true);
    try {
      await validerPanier();
      setSuccesValidation(true);
      setPanier(null);
      setTimeout(() => {
        setSuccesValidation(false);
        setPanierOuvert(false);
      }, 2500);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Impossible de valider la commande.');
    } finally {
      setValidationEnCours(false);
    }
  };

  const nombreArticles = panier?.lignes?.reduce(
    (total, l) => total + l.quantite, 0
  ) || 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent
                        rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Boutique</h1>
          <p className="text-gray-500 mt-1">
            Stylos, cahiers et autres fournitures scolaires
          </p>
        </div>

        <button
          onClick={() => setPanierOuvert(true)}
          className="relative bg-white border border-gray-200 rounded-xl px-4 py-3
                     flex items-center gap-2 hover:bg-gray-50 transition
                     shadow-sm flex-shrink-0"
        >
          <span className="text-xl">🛒</span>
          <span className="hidden sm:inline font-medium text-gray-700 text-sm">
            Panier
          </span>
          {nombreArticles > 0 && (
            <span className="absolute -top-2 -right-2 bg-secondary text-white
                             text-xs w-5 h-5 rounded-full flex items-center
                             justify-center font-bold">
              {nombreArticles}
            </span>
          )}
        </button>
      </div>

      {/* Catalogue */}
      {catalogue.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100
                        p-12 text-center">
          <p className="text-5xl mb-4">🛍️</p>
          <p className="text-gray-500 font-medium">
            Aucun article disponible pour le moment
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {catalogue.map((article) => (
            <div key={article.idAccessoire}
                 className="bg-white rounded-2xl shadow-sm border
                            border-gray-100 p-4 flex flex-col">
              <div className="w-full aspect-square bg-gradient-to-br
                              from-blue-50 to-orange-50 rounded-xl flex
                              items-center justify-center overflow-hidden mb-3">
                {article.imageUrl ? (
                  <img
                    src={BASE_FICHIERS + article.imageUrl}
                    alt={article.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">🖊️</span>
                )}
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                {article.nom}
              </h3>
              {article.description && (
                <p className="text-gray-400 text-xs mb-2 line-clamp-2 flex-1">
                  {article.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="font-black text-secondary">
                  {article.prix} F
                </span>
                <span className="text-xs text-gray-400">
                  {article.quantiteStock > 0
                    ? `${article.quantiteStock} en stock`
                    : 'Rupture'}
                </span>
              </div>
              <button
                onClick={() => handleAjouter(article.idAccessoire)}
                disabled={article.quantiteStock === 0 || enCours === article.idAccessoire}
                className="mt-3 w-full bg-gradient-to-r from-primary to-secondary
                           text-white rounded-xl py-2.5 text-sm font-semibold
                           hover:opacity-90 transition disabled:opacity-50
                           disabled:cursor-not-allowed"
              >
                {enCours === article.idAccessoire
                  ? '...'
                  : article.quantiteStock === 0
                    ? 'Indisponible'
                    : '+ Ajouter'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Panier — drawer latéral */}
      {panierOuvert && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Fond assombri */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPanierOuvert(false)}
          ></div>

          {/* Contenu du panier */}
          <div className="relative bg-white w-full max-w-md h-full shadow-xl
                          flex flex-col">
            <div className="flex items-center justify-between p-6 border-b
                            border-gray-100">
              <h2 className="font-bold text-lg text-gray-900">
                Mon panier
              </h2>
              <button
                onClick={() => setPanierOuvert(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {succesValidation ? (
                <div className="flex flex-col items-center justify-center h-full
                                text-center">
                  <span className="text-5xl mb-4">✅</span>
                  <p className="font-bold text-gray-900 mb-1">
                    Commande enregistrée !
                  </p>
                  <p className="text-gray-500 text-sm">
                    Vous serez notifié quand elle sera prête
                  </p>
                </div>
              ) : !panier?.lignes || panier.lignes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full
                                text-center text-gray-400">
                  <span className="text-5xl mb-4">🛒</span>
                  <p className="font-medium">Votre panier est vide</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {panier.lignes.map((ligne) => (
                    <div key={ligne.idLignePanier}
                         className="flex items-center gap-3 bg-gray-50
                                    rounded-xl p-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex
                                      items-center justify-center text-xl
                                      flex-shrink-0">
                        🖊️
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm
                                      truncate">
                          {ligne.nomAccessoire}
                        </p>
                        <p className="text-xs text-gray-400">
                          {ligne.quantite} × {ligne.prixUnitaire} F
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-secondary text-sm mb-1">
                          {ligne.sousTotal} F
                        </p>
                        <button
                          onClick={() => handleSupprimer(ligne.idLignePanier)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {erreur && (
                <div className="bg-red-50 border border-red-200 text-red-700
                                rounded-xl px-4 py-3 mt-4 text-sm">
                  ⚠️ {erreur}
                </div>
              )}
            </div>

            {panier?.lignes?.length > 0 && !succesValidation && (
              <div className="p-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="font-black text-xl text-secondary">
                    {panier.montantTotal} FCFA
                  </span>
                </div>
                <button
                  onClick={handleValider}
                  disabled={validationEnCours}
                  className="w-full bg-gradient-to-r from-primary to-secondary
                             text-white rounded-xl py-3.5 font-bold
                             hover:opacity-90 transition disabled:opacity-60"
                >
                  {validationEnCours ? 'Validation...' : 'Valider la commande'}
                </button>
                <button
                  onClick={handleViderPanier}
                  disabled={videEnCours}
                  className="w-full mt-2 bg-white border border-red-200
                             text-red-600 rounded-xl py-3 font-semibold
                             hover:bg-red-50 transition disabled:opacity-60"
                >
                  {videEnCours ? '...' : 'Vider le panier'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}