import API from './axios';

export const getCatalogue = () => API.get('/accessoires');
export const getTousLesAccessoires = () => API.get('/accessoires/gerant/tous');
export const publierAccessoire = (formdata) => API.post('/accessoires/gerant', formdata, {headers: {'Content-Type': 'multipart/form-data'},});
export const modifierAccessoire = (id, formdata) =>
  API.put(`/accessoires/gerant/${id}`, formdata, {headers: {'Content-Type': 'multipart/form-data'},});
export const desactiverAccessoire = (id) =>
  API.delete(`/accessoires/gerant/${id}`);
export const reactiverAccessoire = (id) =>
  API.put(`/accessoires/gerant/${id}/reactiver`);