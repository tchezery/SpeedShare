import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5116/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Ocorreu um erro inesperado.';
    
    if (error.response && error.response.data) {
      // Try to extract the message from common backend error formats
      message = error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
    } else if (error.message) {
      message = error.message;
    }

    // Dispatch custom event for the NotificationContext to pick up
    window.dispatchEvent(new CustomEvent('api-error', { 
      detail: { message } 
    }));

    return Promise.reject(error);
  }
);

export const httpClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await api.get<T>(endpoint);
    return response.data;
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await api.post<T>(endpoint, data);
    return response.data;
  },

  upload: async <T>(endpoint: string, files: File[], onProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));

    const response = await api.post<T>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(percentComplete);
        }
      },
    });

    return response.data;
  },

  uploadWithPaths: async <T>(endpoint: string, files: File[], paths: string[], onProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    paths.forEach(path => formData.append('paths', path));

    const response = await api.post<T>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(percentComplete);
        }
      },
    });

    return response.data;
  },

  getUri: (endpoint: string): string => {
    return `${BASE_URL}${endpoint}`;
  },

  download: async (endpoint: string, onProgress?: (progress: number) => void): Promise<{ blob: Blob; filename: string | null }> => {
    const response = await api.get(endpoint, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(percentComplete);
        }
      },
    });
    
    let filename: string | null = null;
    const disposition = response.headers['content-disposition'];
    
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) { 
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    return { blob: response.data, filename };
  }
};