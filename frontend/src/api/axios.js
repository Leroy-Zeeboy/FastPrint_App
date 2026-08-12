import axios from 'axios';

// URL de base du backend Spring Boot
const API = axios.create({
  baseURL: 'http://${window.location.hostname}:8080/api',
});

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
      // Token expiré → déconnexion automatique
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

export default API;