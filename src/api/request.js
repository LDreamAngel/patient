import axiosInstance from './http'
import qs from 'qs';

let baseURL;
if (process.env.NODE_ENV === 'development') {
    baseURL = 'http://www.fangcunhulian.com';
} else {
    baseURL = 'https://www.fangcunhulian.com';
}

axiosInstance.defaults.baseURL = baseURL;

const get = axiosInstance.get;
const post = axiosInstance.post;

export default {
    get,
    post,
    qs,
    baseURL
};
