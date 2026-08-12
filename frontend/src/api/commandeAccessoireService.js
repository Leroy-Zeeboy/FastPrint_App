import API from './axios';

export const getToutesLesCommandesAccessoires = () =>
  API.get('/commandes-accessoires');

export const getCommandesAccessoiresEnAttente = () =>
  API.get('/commandes-accessoires/en-attente');

export const traiterCommandeAccessoire = (id, statut) =>
  API.put(`/commandes-accessoires/${id}/traiter`, { statut });