import { useEffect, useState } from 'react';
import {
  getTarifs,
  creerTarif,
  modifierTarif,
  supprimerTarif,
} from '../../api/tarifAdminService';

const FORM_VIDE = { typeImpression: 'noir_et_blanc', disposition: 'recto_simple', prixUnitaire: '' };

export default function TarifsAdmin() {
  const [tarifs, setTarifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOuvert, setFormOuvert] = useState(false);
  const [tarifEnEdition, setTarifEnEdition] = useState(null);
  const [form, setForm] = useState(FORM_VIDE);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getTarifs();
        setTarifs(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  const recharger = async () => {
    const res = await getTarifs();
    setTarifs(res.data.data || []);
  };

  const ouvrirCreation = () => {
    setTarifEnEdition(null);
    setForm(FORM_VIDE);
    setErreur('');
    setFormOuvert(true);
  };

  const ouvrirEdition = (tarif) => {
    setTarifEnEdition(tarif);
    setForm({
      typeImpression: tarif.typeImpression,
      disposition: tarif.disposition,
      prixUnitaire: tarif.prixUnitaire,
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
      typeImpression: form.typeImpression,
      disposition: form.disposition,
      prixUnitaire: parseFloat(form.prixUnitaire),
    };

    try {
      if (tarifEnEdition) {
        await modifierTarif(tarifEnEdition.idTarif, payload);
      } else {
        await creerTarif(payload);
      }
      setFormOuvert(false);
      await recharger();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setEnvoi(false);
    }
  };

  const handleSupprimer = async (id) => {
    if (!confirm('Supprimer ce tarif ?')) return;
    try {
      await supprimerTarif(id);
      await recharger();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tarifs d'impression</h1>
          <p className="text-gray-500 mt-1">
            Prix par page selon le type et la disposition
          </p>
        </div>
        <button
          onClick={ouvrirCreation}
          className="bg-gradient-to-r from-primary to-secondary text-white
                     rounded-xl px-5 py-3 text-sm font-semibold
                     hover:opacity-90 transition flex-shrink-0"
        >
          + Nouveau tarif
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-secondary
                          border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-semibold text-gray-500">Type</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-500">Disposition</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-500">Prix / page</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tarifs.map((tarif) => (
                <tr key={tarif.idTarif} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {tarif.typeImpression === 'noir_et_blanc' ? '⬛ Noir & Blanc' : '🎨 Couleur'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {tarif.disposition === 'recto_simple' ? 'Recto simple' : 'Recto-verso'}
                  </td>
                  <td className="px-6 py-4 font-bold text-secondary">
                    {tarif.prixUnitaire} FCFA
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => ouvrirEdition(tarif)}
                      className="text-xs font-semibold px-3 py-2 rounded-xl
                                 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleSupprimer(tarif.idTarif)}
                      className="text-xs font-semibold px-3 py-2 rounded-xl
                                 bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      Supprimer
                    </button>
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
              {tarifEnEdition ? 'Modifier le tarif' : 'Nouveau tarif'}
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
                  Type d'impression
                </label>
                <select
                  name="typeImpression"
                  value={form.typeImpression}
                  onChange={handleChange}
                  disabled={!!tarifEnEdition}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3
                             text-sm focus:outline-none focus:ring-2 focus:ring-secondary
                             disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="noir_et_blanc">Noir & Blanc</option>
                  <option value="couleur">Couleur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disposition
                </label>
                <select
                  name="disposition"
                  value={form.disposition}
                  onChange={handleChange}
                  disabled={!!tarifEnEdition}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3
                             text-sm focus:outline-none focus:ring-2 focus:ring-secondary
                             disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="recto_simple">Recto simple</option>
                  <option value="recto_verso">Recto-verso</option>
                </select>
              </div>

              {tarifEnEdition && (
                <p className="text-xs text-gray-400 -mt-2">
                  Le type et la disposition ne peuvent pas être modifiés
                  (contrainte d'unicité) — seul le prix est modifiable.
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix par page (FCFA)
                </label>
                <input
                  type="number"
                  name="prixUnitaire"
                  value={form.prixUnitaire}
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
                  {envoi ? '...' : tarifEnEdition ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}