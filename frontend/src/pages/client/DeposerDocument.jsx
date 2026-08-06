import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { deposerDocument } from '../../api/documentService';
import { getTarifs } from '../../api/tarifService';
import { getForfaits } from '../../api/forfaitService';
import { getOptionsActives } from '../../api/optionFinitionService';
import { PDFDocument } from 'pdf-lib';

export default function DeposerDocument() {
  const navigate = useNavigate();

  const [tarifs, setTarifs] = useState([]);
  const [forfaits, setForfaits] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);

  const [fichier, setFichier] = useState(null);
  const [form, setForm] = useState({
    nombrePages: '',
    typeImpression: '',
    disposition: '',
    idForfaitFinition: '',
    commentaireClient: '',
  });
  const [optionsSelectionnees, setOptionsSelectionnees] = useState([]);

  useEffect(() => {
    const charger = async () => {
      try {
        const [resTarifs, resForfaits, resOptions] = await Promise.all([
          getTarifs(),
          getForfaits(),
          getOptionsActives(),
        ]);
        setTarifs(resTarifs.data.data || []);
        setForfaits(resForfaits.data.data || []);
        setOptions(resOptions.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    charger();
  }, []);
useEffect(() => {
  console.log('Tarifs chargés :', tarifs);
  console.log('Form actuel :', form);
}, [tarifs, form]);
  // Montant estimé — valeur dérivée (recalculée à chaque changement pertinent),
  // pas un état synchronisé par effet.
  const montantEstime = useMemo(() => {
    if (!form.nombrePages || !form.typeImpression || !form.disposition) {
      return null;
    }

    const tarif = tarifs.find(
      t => t.typeImpression === form.typeImpression &&
           t.disposition === form.disposition
    );
    if (!tarif) return null;

    let montant = tarif.prixUnitaire * parseInt(form.nombrePages);

    if (form.idForfaitFinition) {
      const forfait = forfaits.find(
        f => f.idForfait === parseInt(form.idForfaitFinition)
      );
      if (forfait) montant += forfait.prix;
    }

    optionsSelectionnees.forEach(idOption => {
      const option = options.find(o => o.idOption === parseInt(idOption));
      if (option) montant += option.surCout;
    });

    return montant;
  }, [form, optionsSelectionnees, tarifs, forfaits, options]);

  // Gère tous les champs texte / select / radio / textarea du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Gère uniquement la sélection du fichier
  const handleFichierChange = async (e) => {
    const fichierChoisi = e.target.files?.[0];
    if (!fichierChoisi) return;

    setFichier(fichierChoisi);

    // Détecter automatiquement le nombre de pages si c'est un PDF
    if (fichierChoisi.type === 'application/pdf') {
      try {
        const arrayBuffer = await fichierChoisi.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const nombrePages = pdfDoc.getPageCount();
        setForm(prev => ({ ...prev, nombrePages: String(nombrePages) }));
      } catch (err) {
        console.error('Impossible de lire le PDF', err);
      }
    }
  };

  const toggleOption = (idOption) => {
    setOptionsSelectionnees(prev =>
      prev.includes(idOption)
        ? prev.filter(id => id !== idOption)
        : [...prev, idOption]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fichier) {
      setErreur('Veuillez sélectionner un fichier.');
      return;
    }
    setErreur('');
    setEnvoi(true);

    try {
      const formData = new FormData();
      formData.append('fichier', fichier);
      formData.append('nombrePages', form.nombrePages);
      formData.append('typeImpression', form.typeImpression);
      formData.append('disposition', form.disposition);
      if (form.idForfaitFinition) {
        formData.append('idForfaitFinition', form.idForfaitFinition);
      }
      optionsSelectionnees.forEach(id => {
        formData.append('idsOptionsFinition', id);
      });
      if (form.commentaireClient) {
        formData.append('commentaireClient', form.commentaireClient);
      }

      await deposerDocument(formData);
      setSucces(true);
      setTimeout(() => navigate('/client/commandes'), 2000);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors du dépôt.');
    } finally {
      setEnvoi(false);
    }
  };

  const forfaitsFiltres = forfaits.filter(f => {
    if (!form.nombrePages) return true;
    const pages = parseInt(form.nombrePages);
    return pages >= f.palierMin && pages <= f.palierMax;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent
                        rounded-full animate-spin"></div>
      </div>
    );
  }

  if (succes) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center
                        justify-center text-4xl mb-4">
          ✅
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Document déposé !
        </h2>
        <p className="text-gray-500">
          Redirection vers vos commandes...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">
          Déposer un document
        </h1>
        <p className="text-gray-500 mt-1">
          Remplissez le formulaire pour soumettre votre document à l'impression
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* COLONNE GAUCHE — Formulaire */}
          <div className="lg:col-span-2 space-y-6">

            {/* Fichier */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-primary rounded-lg flex items-center
                                 justify-center text-white text-xs font-bold">1</span>
                Sélectionner le fichier
              </h2>

              <label className={`flex flex-col items-center justify-center
                                 border-2 border-dashed rounded-2xl p-8 cursor-pointer
                                 transition ${fichier
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-gray-50 hover:border-secondary hover:bg-blue-50'
                }`}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFichierChange}
                />
                {fichier ? (
                  <>
                    <span className="text-3xl mb-2">✅</span>
                    <p className="font-semibold text-green-700 text-sm">
                      {fichier.name}
                    </p>
                    {form.nombrePages && (
                      <p className="text-green-600 text-xs mt-1 bg-green-100
                                    px-3 py-1 rounded-full font-medium">
                        📄 {form.nombrePages} pages détectées automatiquement
                      </p>
                    )}
                    <p className="text-green-500 text-xs mt-1">
                      Cliquez pour changer
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl mb-3">📄</span>
                    <p className="font-semibold text-gray-700 text-sm">
                      Glissez votre fichier ici
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      PDF (pages détectées auto), DOC, DOCX — Max 10MB
                    </p>
                  </>
                )}
              </label>
            </div>

            {/* Options d'impression */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-primary rounded-lg flex items-center
                                 justify-center text-white text-xs font-bold">2</span>
                Options d'impression
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de pages
                    {fichier?.type === 'application/pdf' && form.nombrePages && (
                      <span className="ml-2 text-xs text-green-600 font-normal">
                        ✓ détecté automatiquement
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    name="nombrePages"
                    value={form.nombrePages}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="Ex: 42"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-secondary bg-gray-50"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Modifiable si nécessaire (ex. pour les fichiers Word)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type d'impression
                  </label>
                  <select
                    name="typeImpression"
                    value={form.typeImpression}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-secondary bg-gray-50"
                  >
                    <option value="">Choisir...</option>
                    <option value="noir_et_blanc">⬛ Noir & Blanc</option>
                    <option value="couleur">🎨 Couleur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Disposition
                  </label>
                  <select
                    name="disposition"
                    value={form.disposition}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-secondary bg-gray-50"
                  >
                    <option value="">Choisir...</option>
                    <option value="recto_simple">Recto simple</option>
                    <option value="recto_verso">Recto-verso</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Forfait de finition */}
            {forfaitsFiltres.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <span className="w-7 h-7 bg-primary rounded-lg flex items-center
                                   justify-center text-white text-xs font-bold">3</span>
                  Forfait de finition
                  <span className="text-xs text-gray-400 font-normal">
                    (optionnel)
                  </span>
                </h2>
                <p className="text-xs text-gray-400 mb-4 ml-9">
                  Plastification + carton + reliure (spirale ou cerneau)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2
                                     cursor-pointer transition ${
                    !form.idForfaitFinition
                      ? 'border-secondary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="idForfaitFinition"
                      value=""
                      checked={!form.idForfaitFinition}
                      onChange={handleChange}
                      className="accent-secondary"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Sans forfait
                      </p>
                      <p className="text-xs text-gray-400">Options à la carte</p>
                    </div>
                  </label>

                  {forfaitsFiltres.map((forfait) => (
                    <label key={forfait.idForfait}
                           className={`flex items-center gap-3 p-4 rounded-xl
                                       border-2 cursor-pointer transition ${
                      form.idForfaitFinition === String(forfait.idForfait)
                        ? 'border-secondary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="idForfaitFinition"
                        value={forfait.idForfait}
                        checked={form.idForfaitFinition === String(forfait.idForfait)}
                        onChange={handleChange}
                        className="accent-secondary"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm capitalize">
                          {forfait.type} — {forfait.palierMin}-{forfait.palierMax} pages
                        </p>
                        <p className="text-xs text-secondary font-bold">
                          {forfait.prix} FCFA
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Options à la carte */}
            {!form.idForfaitFinition && options.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-primary rounded-lg flex items-center
                                   justify-center text-white text-xs font-bold">4</span>
                  Options à la carte
                  <span className="text-xs text-gray-400 font-normal">
                    (optionnel)
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {options.map((option) => (
                    <label key={option.idOption}
                           className={`flex items-center gap-3 p-4 rounded-xl
                                       border-2 cursor-pointer transition ${
                      optionsSelectionnees.includes(option.idOption)
                        ? 'border-secondary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={optionsSelectionnees.includes(option.idOption)}
                        onChange={() => toggleOption(option.idOption)}
                        className="accent-secondary"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">
                          {option.libelle}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {option.categorie.replace('_', ' ')}
                        </p>
                      </div>
                      <span className="text-xs text-secondary font-bold">
                        +{option.surCout} F
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Commentaire */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-primary rounded-lg flex items-center
                                 justify-center text-white text-xs font-bold">5</span>
                Commentaire
                <span className="text-xs text-gray-400 font-normal">(optionnel)</span>
              </h2>
              <textarea
                name="commentaireClient"
                value={form.commentaireClient}
                onChange={handleChange}
                rows={3}
                placeholder="Précisions particulières pour le gérant..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-secondary bg-gray-50 resize-none"
              />
            </div>
          </div>

          {/* COLONNE DROITE — Résumé */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100
                            p-6 sticky top-8">
              <h2 className="font-bold text-gray-900 mb-6">Résumé</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Fichier</span>
                  <span className="font-medium text-gray-900 truncate max-w-32">
                    {fichier ? fichier.name : '—'}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Pages</span>
                  <span className="font-medium text-gray-900">
                    {form.nombrePages || '—'}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Type</span>
                  <span className="font-medium text-gray-900">
                    {form.typeImpression
                      ? form.typeImpression === 'noir_et_blanc'
                        ? 'N&B'
                        : 'Couleur'
                      : '—'}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Disposition</span>
                  <span className="font-medium text-gray-900">
                    {form.disposition
                      ? form.disposition === 'recto_simple'
                        ? 'Recto'
                        : 'R/V'
                      : '—'}
                  </span>
                </div>

                <hr className="border-gray-100" />

                <div className="flex justify-between font-bold text-lg">
                  <span className="text-gray-900">Total estimé</span>
                  <span className="text-secondary">
                    {montantEstime !== null
                      ? `${montantEstime} FCFA`
                      : '—'}
                  </span>
                </div>
              </div>

              {erreur && (
                <div className="bg-red-50 border border-red-200 text-red-700
                                rounded-xl px-4 py-3 mt-4 text-sm">
                  ⚠️ {erreur}
                </div>
              )}

              <button
                type="submit"
                disabled={envoi}
                className="w-full mt-6 bg-gradient-to-r from-primary to-secondary
                           text-white rounded-xl py-4 font-bold hover:opacity-90
                           transition shadow-md disabled:opacity-60
                           disabled:cursor-not-allowed"
              >
                {envoi ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white
                                     border-t-transparent rounded-full
                                     animate-spin"></span>
                    Envoi en cours...
                  </span>
                ) : (
                  '📤 Déposer le document'
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                💡 Montant calculé automatiquement selon la grille tarifaire
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}