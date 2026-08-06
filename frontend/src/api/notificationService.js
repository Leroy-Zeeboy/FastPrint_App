import API from './axios';

export const getMesNotifications = () => API.get('/notifications');
export const getNotificationsNonLues = () => API.get('/notifications/non-lues');
export const getCompteurNonLues = () => API.get('/notifications/compteur');
export const marquerCommeLue = (id) => API.put(`/notifications/${id}/lire`);
export const marquerToutesCommeLues = () => API.put('/notifications/lire-toutes');