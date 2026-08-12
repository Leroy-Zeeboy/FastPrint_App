import API from './axios';

export const getStats = () => API.get('/admin/stats');

export const getTousLesUtilisateurs = () => API.get('/admin/utilisateurs');

export const modifierRoleUtilisateur = (id, role) =>
  API.put(`/admin/utilisateurs/${id}/role`, { role });

export const modifierStatutUtilisateur = (id, statut) =>
  API.put(`/admin/utilisateurs/${id}/statut`, { statut });