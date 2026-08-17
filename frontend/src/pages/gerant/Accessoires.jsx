import { useEffect, useState } from 'react';
import {
  getTousLesAccessoires,
  publierAccessoire,
  modifierAccessoire,
  desactiverAccessoire,
  reactiverAccessoire,
} from '../../api/accessoireService';

const FORM_VIDE = { nom: '', description: '', prix: '', quantiteStock: '' };

// Base pour les images servies statiquement (hors préfixe /api)
const BASE_FICHIERS = import.meta.env.VITE_FILES_URL || `http://localhost:8080`;

export default function Accessoires() {
  const [catalogue, setCatalogue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOuvert, setFormOuvert] = useState(false);
  const [accessoireEnEdition, setAccessoireEnEdition] = useState(null);
  const [form, setForm] = useState(FORM_VIDE);
  const [imageFichier, setImageFichier] = useState(null);
  const [imageApercu, setImageApercu] = useState(null);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  const charger = async () => {
    try {
      const res = await getTousLesAccessoires();
      setCatalogue(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const ouvrirCreation = () => {
    setAccessoireEnEdition(null);
    setForm(FORM_VIDE);
    setImageFichier(null);
    setImageApercu(null);
    setErreur('');
    setFormOuvert(true);
  };

  const ouvrirEdition = (accessoire) => {
    setAccessoireEnEdition(accessoire);
    setForm({
      nom: accessoire.nom,
      description: accessoire.description || '',
      prix: accessoire.prix,
      quantiteStock: accessoire.quantiteStock,
    });
    setImageFichier(null);
    setImageApercu(
      accessoire.imageUrl
        ? (accessoire.imageUrl.startsWith('http')
            ? accessoire.imageUrl
            : BASE_FICHIERS + accessoire.imageUrl)
        : null
    );
    setErreur('');
    setFormOuvert(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    setImageFichier(fichier);
    setImageApercu(URL.createObjectURL(fichier));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);

    const formData = new FormData();
    formData.append('nom', form.nom);
    formData.append('description', form.description);
    formData.append('prix', form.prix);
    formData.append('quantiteStock', form.quantiteStock);
    if (imageFichier) {
      formData.append('image', imageFichier);
    }

    try {
      if (accessoireEnEdition) {
        await modifierAccessoire(accessoireEnEdition.idAccessoire, formData);
      } else {
        await publierAccessoire(formData);
      }
      setFormOuvert(false);
      await charger();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setEnvoi(false);
    }
  };

  const handleDesactiver = async (id) => {
    if (!confirm('Désactiver cet accessoire ? Il ne sera plus visible dans la boutique.')) {
      return;
    }
    try {
      await desactiverAccessoire(id);
      await charger();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur lors de la désactivation.');
    }
  };

  const handleReactiver = async (id) => {
    try {
      await reactiverAccessoire(id);
      await charger();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erreur lors de la réactivation.');
    }
  };

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Accessoires</h1>
          <p className="text-gray-500 mt-1">
            Gérez le catalogue de fournitures de la boutique
          </p>
        </div>
        <button
          onClick={ouvrirCreation}
          className="bg-gradient-to-r from-primary to-secondary text-white
                     rounded-xl px-5 py-3 text-sm font-semibold
                     hover:opacity-90 transition flex-shrink-0"
        >
          + Publier un accessoire
        </button>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-secondary
                          border-t-transparent rounded-full animate-spin">
          </div>
        </div>
      ) : catalogue.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100
                        p-12 text-center">
          <p className="text-5xl mb-4">🛍️</p>
          <p className="text-gray-500 font-medium">
            Aucun accessoire publié
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalogue.map((accessoire) => (
            <div key={accessoire.idAccessoire}
                 className={`bg-white rounded-2xl shadow-sm border p-5 ${
                   accessoire.actif ? 'border-gray-100' : 'border-gray-200 opacity-70'
                 }`}>
              {/* Cadre image */}
              <div className="w-full aspect-square bg-gradient-to-br from-blue-50
                              to-orange-50 rounded-xl flex items-center
                              justify-center overflow-hidden mb-3">
                {accessoire.imageUrl ? (
                  <img
                    src={
                      accessoire.imageUrl.startsWith('http')
                        ? accessoire.imageUrl
                        : BASE_FICHIERS + accessoire.imageUrl
                    }
                    alt={accessoire.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">🖊️</span>
                )}
              </div>

              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-gray-900">
                  {accessoire.nom}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium
                                  flex-shrink-0 ${
                  accessoire.actif
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {accessoire.actif ? 'Actif' : 'Désactivé'}
                </span>
              </div>
              {accessoire.description && (
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                  {accessoire.description}
                </p>
              )}
              <div className="flex items-center justify-between mb-4">
                <span className="font-black text-secondary">
                  {accessoire.prix} FCFA
                </span>
                <span className="text-xs text-gray-400">
                  Stock : {accessoire.quantiteStock}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => ouvrirEdition(accessoire)}
                  className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-2
                             text-sm font-medium hover:bg-gray-200 transition"
                >
                  Modifier
                </button>
                {accessoire.actif ? (
                  <button
                    onClick={() => handleDesactiver(accessoire.idAccessoire)}
                    className="flex-1 bg-red-50 text-red-600 rounded-xl py-2
                               text-sm font-medium hover:bg-red-100 transition"
                  >
                    Désactiver
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactiver(accessoire.idAccessoire)}
                    className="flex-1 bg-green-50 text-green-600 rounded-xl py-2
                               text-sm font-medium hover:bg-green-100 transition"
                  >
                    Réactiver
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire création/édition */}
      {formOuvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFormOuvert(false)}
          ></div>

          <div className="relative bg-white rounded-2xl shadow-xl w-full
                          max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-lg text-gray-900 mb-4">
              {accessoireEnEdition ? 'Modifier l\'accessoire' : 'Publier un accessoire'}
            </h2>

            {erreur && (
              <div className="bg-red-50 border border-red-200 text-red-700
                              rounded-xl px-4 py-3 mb-4 text-sm">
                {erreur}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Cadre image + upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <label className="block w-full aspect-video bg-gray-50
                                  border-2 border-dashed border-gray-200
                                  rounded-xl overflow-hidden cursor-pointer
                                  hover:border-secondary transition relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imageApercu ? (
                    <img
                      src={imageApercu}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center
                                    justify-center text-gray-400">
                      <span className="text-3xl mb-1">📷</span>
                      <span className="text-xs">Cliquez pour ajouter une image</span>
                    </div>
                  )}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  placeholder="Ex : Stylo bleu Bic"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3
                             text-sm focus:outline-none focus:ring-2
                             focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Précisions sur l'article (optionnel)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3
                             text-sm focus:outline-none focus:ring-2
                             focus:ring-secondary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix (FCFA)
                  </label>
                  <input
                    type="number"
                    name="prix"
                    value={form.prix}
                    onChange={handleChange}
                    required
                    min="0"
                    step="1"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="quantiteStock"
                    value={form.quantiteStock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-secondary"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFormOuvert(false)}
                  className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-3
                             font-semibold hover:bg-gray-200 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={envoi}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary
                             text-white rounded-xl py-3 font-semibold
                             hover:opacity-90 transition disabled:opacity-60"
                >
                  {envoi ? '...' : accessoireEnEdition ? 'Enregistrer' : 'Publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}