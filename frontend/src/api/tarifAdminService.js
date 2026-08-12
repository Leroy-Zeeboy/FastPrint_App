import API from './axios';

export const getTarifs = () => API.get('/tarifs');

export const creerTarif = (data) => API.post('/tarifs/admin', data);

export const modifierTarif = (id, data) => API.put(`/tarifs/admin/${id}`, data);

export const supprimerTarif = (id) => API.delete(`/tarifs/admin/${id}`);