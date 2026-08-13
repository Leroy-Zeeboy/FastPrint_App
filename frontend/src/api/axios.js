import axios from 'axios';

// Priorité : variable d'environnement (production/Vercel) définie via VITE_API_URL.
// À défaut (développement local/LAN), on déduit l'hôte automatiquement.
const baseURL = import.meta.env.VITE_API_URL
  || `http://${window.location.hostname}:8080/api`;

const API = axios.create({ baseURL });

// Intercepteur : ajoute automatiquement le token JWT
// à chaque requête sortante
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur : gère les erreurs globalement
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

export default API;