import API from './axios';

export const getToutesLesOptions = () => API.get('/options-finition/admin/toutes');

export const creerOption = (data) => API.post('/options-finition/admin', data);

export const modifierOption = (id, data) => API.put(`/options-finition/admin/${id}`, data);

export const desactiverOption = (id) => API.delete(`/options-finition/admin/${id}`);

export const activerOption = (id) => API.put(`/options-finition/admin/${id}/activer`);
