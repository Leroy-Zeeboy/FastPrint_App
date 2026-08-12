import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { getStats } from '../../api/adminService';

const COULEURS_STATUT = {
  'En attente': '#f59e0b',
  'Prêtes': '#22c55e',
  'Refusées': '#ef4444',
};

const COULEURS_REPARTITION = ['#1e3a8a', '#3b82f6', '#f97316'];

function CarteStat({ icone, couleur, label, valeur, sousLabel }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: couleur + '1A', color: couleur }}
        >
          {icone}
        </div>
      </div>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-900">{valeur}</p>
      {sousLabel && <p className="text-xs text-gray-400 mt-1">{sousLabel}</p>}
    </div>
  );
}

export default function AdminHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getStats();
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
        setErreur('Impossible de charger les statistiques.');
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
        ⚠️ {erreur}
      </div>
    );
  }

  const caDocuments = Number(stats.chiffreAffairesDocuments);
  const caAccessoires = Number(stats.chiffreAffairesAccessoires);
  const chiffreAffairesTotal = caDocuments + caAccessoires;

  const donneesCommandes = [
    { name: 'En attente', valeur: stats.commandesDocumentsEnAttente },
    { name: 'Prêtes', valeur: stats.commandesDocumentsPretes },
    { name: 'Refusées', valeur: stats.commandesDocumentsRefusees },
  ];

  const donneesRepartition = [
    { name: 'Clients', value: stats.totalClients },
    { name: 'Gérants', value: stats.totalGerants },
    { name: 'Administrateurs', value: stats.totalAdministrateurs },
  ];

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">
          Bonjour, {user?.prenom} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Vue d'ensemble de la plateforme FastPrint
        </p>
      </div>

      {/* Chiffre d'affaires total */}
      <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white shadow-md mb-6">
        <p className="text-blue-100 text-sm mb-1">Chiffre d'affaires total</p>
        <p className="text-4xl font-black">
          {chiffreAffairesTotal.toLocaleString('fr-FR')} FCFA
        </p>
        <div className="flex gap-6 mt-4 text-sm text-blue-100">
          <span>📄 Documents : {caDocuments.toLocaleString('fr-FR')} F</span>
          <span>🛍️ Accessoires : {caAccessoires.toLocaleString('fr-FR')} F</span>
        </div>
      </div>

      {/* Cartes stats avec icônes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <CarteStat
          icone="👥" couleur="#1e3a8a"
          label="Utilisateurs" valeur={stats.totalUtilisateurs}
          sousLabel={`${stats.totalClients} clients`}
        />
        <CarteStat
          icone="📄" couleur="#3b82f6"
          label="Commandes documents" valeur={stats.totalCommandesDocuments}
          sousLabel={`${stats.commandesDocumentsEnAttente} en attente`}
        />
        <CarteStat
          icone="🛍️" couleur="#f97316"
          label="Commandes articles" valeur={stats.totalCommandesAccessoires}
          sousLabel={`${stats.commandesAccessoiresEnAttente} en attente`}
        />
        <CarteStat
          icone="📦" couleur="#22c55e"
          label="Accessoires actifs" valeur={stats.totalAccessoiresActifs}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-1">Commandes de documents</h2>
          <p className="text-gray-400 text-xs mb-4">Répartition par statut</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={donneesCommandes}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="valeur" radius={[8, 8, 0, 0]} barSize={48}>
                {donneesCommandes.map((entree, index) => (
                  <Cell key={index} fill={COULEURS_STATUT[entree.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-1">Utilisateurs</h2>
          <p className="text-gray-400 text-xs mb-4">Répartition par rôle</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={donneesRepartition}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
              >
                {donneesRepartition.map((_, index) => (
                  <Cell key={index} fill={COULEURS_REPARTITION[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12, color: '#6b7280' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}