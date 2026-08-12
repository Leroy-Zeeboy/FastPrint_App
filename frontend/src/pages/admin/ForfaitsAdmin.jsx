import { useEffect, useState } from 'react';
import {
  getForfaits,
  creerForfait,
  modifierForfait,
  supprimerForfait,
} from '../../api/forfaitAdminService';

const FORM_VIDE = { type: 'standard', palierMin: '', palierMax: '', prix: '' };

export default function ForfaitsAdmin() {
  const [forfaits, setForfaits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOuvert, setFormOuvert] = useState(false);
  const [forfaitEnEdition, setForfaitEnEdition] = useState(null);
  const [form, setForm] = useState(FORM_VIDE);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getForfaits();
        setForfaits(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  const recharger = async () => {
    const res = await getForfaits();
    setForfaits(res.data.data || []);
  };

  const ouvrirCreation = () => {
    setForfaitEnEdition(null);
    setForm(FORM_VIDE);
    setErreur('');
    setFormOuvert(true);
  };

  const ouvrirEdition = (forfait) => {
    setForfaitEnEdition(forfait);
    setForm({
      type: forfait.type,
      palierMin: forfait.palierMin,
      palierMax: forfait.palierMax,
      prix: forfait.prix,
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
      type: form.type,
      palierMin: parseInt(form.palierMin),
      palierMax: parseInt(form.palierMax),
      prix: parseFloat(form.prix),
    };

    try {
      if (forfaitEnEdition) {
        await modifierForfait(forfaitEnEdition.idForfait, payload);
      } else {
        await creerForfait(payload);
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
    if (!confirm('Supprimer ce forfait ?')) return;
    try {
      await supprimerForfait(id);
      await recharger();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Forfaits de finition</h1>
          <p className="text-gray-500 mt-1">
            Plastification + carton + reliure, selon le nombre de pages
          </p>
        </div>
        <button
          onClick={ouvrirCreation}
          className="bg-gradient-to-r from-primary to-secondary text-white
                     rounded-xl px-5 py-3 text-sm font-semibold
                     hover:opacity-90 transition flex-shrink-0"
        >
          + Nouveau forfait
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-secondary
                          border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : forfaits.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100
                        p-12 text-center">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-gray-500 font-medium">Aucun forfait configuré</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-semibold text-gray-500">Type</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-500">Palier (pages)</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-500">Prix</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {forfaits.map((forfait) => (
                <tr key={forfait.idForfait} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-4 font-medium text-gray-900 capitalize">
                    {forfait.type}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {forfait.palierMin} – {forfait.palierMax} pages
                  </td>
                  <td className="px-6 py-4 font-bold text-secondary">
                    {forfait.prix} FCFA
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => ouvrirEdition(forfait)}
                      className="text-xs font-semibold px-3 py-2 rounded-xl
                                 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleSupprimer(forfait.idForfait)}
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
              {forfaitEnEdition ? 'Modifier le forfait' : 'Nouveau forfait'}
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
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3
                             text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Palier min (pages)
                  </label>
                  <input
                    type="number"
                    name="palierMin"
                    value={form.palierMin}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3
                               text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Palier max (pages)
                  </label>
                  <input
                    type="number"
                    name="palierMax"
                    value={form.palierMax}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3
                               text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

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
                  {envoi ? '...' : forfaitEnEdition ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}