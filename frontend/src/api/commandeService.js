import API from './axios';
export const getMesCommandes = () => API.get('/commandes/mes-commandes');
export const getCommandesEnAttente = () => API.get('/commandes/en-attente');
export const getCommandesTraitees = () => API.get('/commandes/traitees');
export const getCommandeParId = (id) => API.get(`/commandes/${id}`);
export const traiterCommande = (id, data) =>
  API.put(`/commandes/${id}/traiter`, data);