import { useEffect, useState } from 'react';
import {
  getMesNotifications,
  marquerCommeLue,
  marquerToutesCommeLues,
} from '../../api/notificationService';

const TYPE_ICONS = {
  commande: '📦',
  paiement: '💳',
  systeme: '⚙️',
  document: '📄',
};

const getTypeIcon = (type) => TYPE_ICONS[type] || '🔔';

const formatDate = (dateEnvoi) => {
  const date = new Date(dateEnvoi);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState('toutes'); // 'toutes' | 'non_lues'
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getMesNotifications();
        setNotifications(res.data.data || []);
      } catch (err) {
        console.error(err);
        setErreur('Impossible de charger les notifications.');
      } finally {
        setLoading(false);
      }
    };
    charger();
  }, []);

  const compteurNonLues = notifications.filter((n) => !n.lu).length;

  const notificationsAffichees =
    filtre === 'non_lues' ? notifications.filter((n) => !n.lu) : notifications;

  const handleClicNotification = async (notification) => {
    if (notification.lu) return;

    // Mise à jour optimiste
    setNotifications((prev) =>
      prev.map((n) =>
        n.idNotification === notification.idNotification ? { ...n, lu: true } : n
      )
    );

    try {
      await marquerCommeLue(notification.idNotification);
    } catch (err) {
      console.error(err);
      // rollback en cas d'échec
      setNotifications((prev) =>
        prev.map((n) =>
          n.idNotification === notification.idNotification ? { ...n, lu: false } : n
        )
      );
    }
  };

  const handleToutMarquer = async () => {
    const avant = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
    try {
      await marquerToutesCommeLues();
    } catch (err) {
      console.error(err);
      setNotifications(avant);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="w-10 h-10 border-4 border-secondary border-t-transparent
                        rounded-full animate-spin"
        ></div>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">
            {compteurNonLues > 0
              ? `${compteurNonLues} notification${compteurNonLues > 1 ? 's' : ''} non lue${
                  compteurNonLues > 1 ? 's' : ''
                }`
              : 'Vous êtes à jour'}
          </p>
        </div>

        {compteurNonLues > 0 && (
          <button
            onClick={handleToutMarquer}
            className="bg-gradient-to-r from-primary to-secondary text-white
                       px-5 py-2.5 rounded-xl text-sm font-semibold
                       hover:opacity-90 transition self-start sm:self-auto"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFiltre('toutes')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            filtre === 'toutes'
              ? 'bg-secondary text-white'
              : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
          }`}
        >
          Toutes ({notifications.length})
        </button>
        <button
          onClick={() => setFiltre('non_lues')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            filtre === 'non_lues'
              ? 'bg-secondary text-white'
              : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
          }`}
        >
          Non lues ({compteurNonLues})
        </button>
      </div>

      {erreur && (
        <div
          className="bg-red-50 border border-red-200 text-red-700
                        rounded-xl px-4 py-3 mb-6 text-sm"
        >
          ⚠️ {erreur}
        </div>
      )}

      {/* Liste */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {notificationsAffichees.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">🔕</p>
            <p className="text-gray-500 font-medium">
              {filtre === 'non_lues'
                ? 'Aucune notification non lue'
                : "Aucune notification pour l'instant"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notificationsAffichees.map((notification) => (
              <button
                key={notification.idNotification}
                onClick={() => handleClicNotification(notification)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl
                            text-left transition ${
                              notification.lu
                                ? 'bg-gray-50 hover:bg-gray-100'
                                : 'bg-blue-50 hover:bg-blue-100 border border-blue-100'
                            }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center
                                 justify-center text-lg flex-shrink-0 ${
                                   notification.lu
                                     ? 'bg-gray-200'
                                     : 'bg-gradient-to-br from-primary to-secondary'
                                 }`}
                >
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      notification.lu ? 'text-gray-600' : 'text-gray-900 font-semibold'
                    }`}
                  >
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(notification.dateEnvoi)}
                  </p>
                </div>
                {!notification.lu && (
                  <span
                    className="w-2.5 h-2.5 bg-secondary rounded-full
                                   flex-shrink-0 mt-1.5"
                  ></span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}