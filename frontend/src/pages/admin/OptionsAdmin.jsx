import { useEffect, useState } from 'react';
import {
  getToutesLesOptions,
  creerOption,
  modifierOption,
  desactiverOption,
  activerOption,
} from '../../api/optionFinitionAdminService';

const FORM_VIDE = { categorie: 'premiere_page', libelle: '', surCout: '' };

export default function OptionsAdmin() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOuvert, setFormOuvert] = useState(false);
  const [optionEnEdition, setOptionEnEdition] = useState(null);
  const [form, setForm] = useState(FORM_VIDE);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getToutesLesOptions();
        setOptions(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  const recharger = async () => {
    const res = await getToutesLesOptions();
    setOptions(res.data.data || []);
  };

  const getCategorieLabel = (categorie) => {
    switch (categorie) {
      case 'premiere_page': return 'Première page';
      case 'couverture': return 'Couverture';
      case 'reliure': return 'Reliure';
      default: return categorie;
    }
  };

  const ouvrirCreation = () => {
    setOptionEnEdition(null);
    setForm(FORM_VIDE);
    setErreur('');
    setFormOuvert(true);
  };

  const ouvrirEdition = (option) => {
    setOptionEnEdition(option);
    setForm({
      categorie: option.categorie,
      libelle: option.libelle,
      surCout: option.surCout,
    });
    setErreur('');
    setFormOuvert(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);

    const payload = {
      categorie: form.categorie,
      libelle: form.libelle,
      surCout: parseFloat(form.surCout),
    };

    try {
      if (optionEnEdition) {
        await modifierOption(optionEnEdition.idOption, payload);
      } else {
        await creerOption(payload);
      }
      setFormOuvert(false);
      await recharger();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setEnvoi(false);
    }
  };

  const handleDesactiver = async (id) => {
    try {
      await desactiverOption(id);
      await recharger();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur.');
    }
  };

  const handleActiver = async (id) => {
    try {
      await activerOption(id);
      await recharger();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur.');
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Options de finition</h1>
          <p className="text-gray-500 mt-1">
            Options à la carte proposées lors du dépôt de document
          </p>
        </div>
        <button
          onClick={ouvrirCreation}
          className="bg-gradient-to-r from-primary to-secondary text-white
                     rounded-xl px-5 py-3 text-sm font-semibold
                     hover:opacity-90 transition flex-shrink-0"
        >
          + Nouvelle option
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-secondary
                          border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : options.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100
                        p-12 text-center">
          <p className="text-5xl mb-4">⚙️</p>
          <p className="text-gray-500 font-medium">Aucune option configurée</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-semibold text-gray-500">Libellé</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-500">Catégorie</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-500">Sur-coût</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-500">Statut</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {options.map((option) => (
                <tr key={option.idOption}
                    className={`border-b border-gray-50 last:border-0 ${
                      !option.actif ? 'opacity-60' : ''
                    }`}>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {option.libelle}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {getCategorieLabel(option.categorie)}
                  </td>
                  <td className="px-6 py-4 font-bold text-secondary">
                    +{option.surCout} FCFA
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                      option.actif
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {option.actif ? 'Active' : 'Désactivée'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => ouvrirEdition(option)}
                      className="text-xs font-semibold px-3 py-2 rounded-xl
                                 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    >
                      Modifier
                    </button>
                    {option.actif ? (
                      <button
                        onClick={() => handleDesactiver(option.idOption)}
                        className="text-xs font-semibold px-3 py-2 rounded-xl
                                   bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        Désactiver
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActiver(option.idOption)}
                        className="text-xs font-semibold px-3 py-2 rounded-xl
                                   bg-green-50 text-green-600 hover:bg-green-100 transition"
                      >
                        Réactiver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOuvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFormOuvert(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">
              {optionEnEdition ? 'Modifier l\'option' : 'Nouvelle option'}
            </h2>

            {erreur && (
              <div className="bg-red-50 border border-red-200 text-red-700
                              rounded-xl px-4 py-3 mb-4 text-sm">
                {erreur}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  name="categorie"
                  value={form.categorie}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3
                             text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="premiere_page">Première page</option>
                  <option value="couverture">Couverture</option>
                  <option value="reliure">Reliure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Libellé
                </label>
                <input
                  type="text"
                  name="libelle"
                  value={form.libelle}
                  onChange={handleChange}
                  required
                  placeholder="Ex : Couverture plastifiée"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3
                             text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sur-coût (FCFA)
                </label>
                <input
                  type="number"
                  name="surCout"
                  value={form.surCout}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3
                             text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
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
                  {envoi ? '...' : optionEnEdition ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}