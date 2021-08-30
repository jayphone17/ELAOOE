import axios from 'axios';

axios.defaults.baseURL = 'https://api.lin-eng.raka.link';

axios.interceptors.request.use((request) => {
  request.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  return request;
});

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (err, e) => {
    console.log('response', err, e);
    if (!err.response) {
      location.href = '/#/login';
    }
    if (err.response?.status === 401) {
      location.href = '/#/login';
    }
    return Promise.reject(err);
  }
);

export { axios as api };
