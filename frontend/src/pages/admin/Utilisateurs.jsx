import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getTousLesUtilisateurs,
  modifierRoleUtilisateur,
  modifierStatutUtilisateur,
} from '../../api/adminService';

const ROLES = ['client', 'gerant', 'administrateur'];

export default function Utilisateurs() {
  const { user: moi } = useAuth();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreRole, setFiltreRole] = useState('tous');
  const [recherche, setRecherche] = useState('');
  const [enCours, setEnCours] = useState(null);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getTousLesUtilisateurs();
        setUtilisateurs(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  const getRoleStyle = (role) => {
    switch (role) {
      case 'administrateur': return 'bg-purple-100 text-purple-700';
      case 'gerant': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'administrateur': return 'Administrateur';
      case 'gerant': return 'Gérant';
      default: return 'Client';
    }
  };

  const handleChangerRole = async (id, nouveauRole) => {
    setErreur('');
    setEnCours(id);
    try {
      const res = await modifierRoleUtilisateur(id, nouveauRole);
      setUtilisateurs(prev =>
        prev.map(u => u.idUtilisateur === id ? res.data.data : u)
      );
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors du changement de rôle.');
    } finally {
      setEnCours(null);
    }
  };

  const handleChangerStatut = async (id, statutActuel) => {
    const nouveauStatut = statutActuel === 'actif' ? 'inactif' : 'actif';
    if (nouveauStatut === 'inactif'
        && !confirm('Désactiver ce compte ? L\'utilisateur ne pourra plus se connecter.')) {
      return;
    }
    setErreur('');
    setEnCours(id);
    try {
      const res = await modifierStatutUtilisateur(id, nouveauStatut);
      setUtilisateurs(prev =>
        prev.map(u => u.idUtilisateur === id ? res.data.data : u)
      );
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors du changement de statut.');
    } finally {
      setEnCours(null);
    }
  };

  const filtres = [
    { valeur: 'tous', label: 'Tous' },
    { valeur: 'client', label: 'Clients' },
    { valeur: 'gerant', label: 'Gérants' },
    { valeur: 'administrateur', label: 'Administrateurs' },
  ];

  const utilisateursFiltres = utilisateurs
    .filter(u => filtreRole === 'tous' || u.role === filtreRole)
    .filter(u => {
      if (!recherche.trim()) return true;
      const terme = recherche.toLowerCase();
      return (
        u.nom.toLowerCase().includes(terme) ||
        u.prenom.toLowerCase().includes(terme) ||
        u.email.toLowerCase().includes(terme)
      );
    });

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Utilisateurs</h1>
        <p className="text-gray-500 mt-1">
          Gérez les comptes clients, gérants et administrateurs
        </p>
      </div>

      {/* Recherche + filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher par nom, prénom ou email..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3
                     text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <div className="flex flex-wrap gap-2">
          {filtres.map((filtre) => (
            <button
              key={filtre.valeur}
              onClick={() => setFiltreRole(filtre.valeur)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filtreRole === filtre.valeur
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filtre.label}
            </button>
          ))}
        </div>
      </div>

      {erreur && (
        <div className="bg-red-50 border border-red-200 text-red-700
                        rounded-xl px-4 py-3 mb-6 text-sm">
          ⚠️ {erreur}
        </div>
      )}

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-secondary
                          border-t-transparent rounded-full animate-spin">
          </div>
        </div>
      ) : utilisateursFiltres.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100
                        p-12 text-center">
          <p className="text-5xl mb-4">👤</p>
          <p className="text-gray-500 font-medium">
            Aucun utilisateur trouvé
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100
                        overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 font-semibold text-gray-500">
                    Utilisateur
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500">
                    Contact
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500">
                    Rôle
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-500">
                    Statut
                  </th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {utilisateursFiltres.map((utilisateur) => {
                  const estMoi = utilisateur.idUtilisateur === moi?.idUtilisateur
                    || utilisateur.email === moi?.email;

                  return (
                    <tr key={utilisateur.idUtilisateur}
                        className="border-b border-gray-50 last:border-0
                                   hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-primary
                                          to-secondary rounded-full flex
                                          items-center justify-center text-white
                                          text-xs font-bold flex-shrink-0">
                            {utilisateur.prenom?.[0]}{utilisateur.nom?.[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {utilisateur.prenom} {utilisateur.nom}
                              {estMoi && (
                                <span className="ml-2 text-xs text-gray-400">
                                  (vous)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <p>{utilisateur.email}</p>
                        {utilisateur.telephone && (
                          <p className="text-xs text-gray-400">
                            {utilisateur.telephone}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={utilisateur.role}
                          onChange={(e) =>
                            handleChangerRole(utilisateur.idUtilisateur, e.target.value)
                          }
                          disabled={estMoi || enCours === utilisateur.idUtilisateur}
                          className={`text-xs font-medium rounded-full px-3 py-1.5
                                      border-0 cursor-pointer disabled:cursor-not-allowed
                                      disabled:opacity-60 ${getRoleStyle(utilisateur.role)}`}
                        >
                          {ROLES.map((role) => (
                            <option key={role} value={role}>
                              {getRoleLabel(role)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                          utilisateur.statut === 'actif'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {utilisateur.statut === 'actif' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            handleChangerStatut(utilisateur.idUtilisateur, utilisateur.statut)
                          }
                          disabled={estMoi || enCours === utilisateur.idUtilisateur}
                          className={`text-xs font-semibold px-4 py-2 rounded-xl
                                      transition disabled:opacity-40
                                      disabled:cursor-not-allowed ${
                            utilisateur.statut === 'actif'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          {enCours === utilisateur.idUtilisateur
                            ? '...'
                            : utilisateur.statut === 'actif'
                              ? 'Désactiver'
                              : 'Réactiver'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}