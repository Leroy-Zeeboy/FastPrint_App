import API from './axios';

export const getForfaits = () => API.get('/forfaits');

export const creerForfait = (data) => API.post('/forfaits/admin', data);

export const modifierForfait = (id, data) => API.put(`/forfaits/admin/${id}`, data);

export const supprimerForfait = (id) => API.delete(`/forfaits/admin/${id}`);