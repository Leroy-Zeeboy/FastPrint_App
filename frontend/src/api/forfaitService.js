import API from './axios';

export const getForfaits = () => API.get('/forfaits');