import API from './axios';

export const deposerDocument = (formData) =>
  API.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getMesDocuments = () => API.get('/documents/mes-documents');

export const getUrlTelechargement = (idDocument) =>
  API.get(`/documents/${idDocument}/telecharger`);


