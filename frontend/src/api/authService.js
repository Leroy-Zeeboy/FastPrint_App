import API from './axios';

export const inscription = (data) => API.post('/auth/inscription', data);
export const connexion = (data) => API.post('/auth/connexion', data);