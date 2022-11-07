import axios from 'axios';
// import CFG from '../common/Config'
axios.defaults.timeout = 5000;
const axiosObj = axios.create();

// http response 拦截器
axiosObj.interceptors.response.use(
  response => {
    return response.data;
  },
  errorData => {
    return Promise.reject(errorData);
  }
);

export default axiosObj;
