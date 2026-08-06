import API from './axios';

export const getMonPanier = () => API.get('/panier');
export const ajouterAuPanier = (data) => API.post('/panier', data);
export const supprimerDuPanier = (idLigne) => API.delete(`/panier/${idLigne}`);
export const viderPanier = () => API.delete('/panier');
export const validerPanier = () => API.post('/panier/valider');