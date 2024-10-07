import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000,
  header: {
    Accept: 'application/json',
    ContentType: 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (Boolean(token)) {
      config.headers.Authorization = ['Bearer', token].join(' ');
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.status === 401) {
      localStorage.clear();

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
