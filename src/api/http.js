import axios from 'axios';
import {Message} from 'element-ui';
import router from '@/router';
import store from '@/store';

const instance = axios.create();

instance.defaults.timeout = 5000;

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//http request 拦截器
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        // token && (config.headers.Authorization = token);
        let params = config['params'] || {};

        if (token) {
            params['token'] = token;
        }

        if (process.env.NODE_ENV === 'development') {
            params['dev_user'] = process.env.DEV_USER || 'sunshu';
        }

        config['params'] = params;
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

//http response 拦截器
instance.interceptors.response.use(
    response => {
        switch (response.data.errno) {
            case "0":
                return Promise.resolve(responseToObject(response));
            // 权限验证相关
            case "20012":
            case "20013":
            case "20007":
                store.commit('updateUserStatus', null);

                router.push({
                    path: "/login",
                    query: {redirect: router.currentRoute.fullPath}//从哪个页面跳转
                });
                return Promise.reject(responseToObject(response));
            case "50006": // 选择正在进行中的问诊； 这里特殊处理一下，不想看到这个错误提示
                break;
            default:
                Message({
                    showClose: true,
                    message: response.data.errmsg,
                    type: 'error'
                });
                return Promise.reject(responseToObject(response));
        }
    },
    err => {
        Message({
            showClose: true,
            message: '系统错误',
            type: 'error'
        });
        return Promise.reject(err)
    }
);

function responseToObject(response) {
    let result = {};

    result.errno = response.data.errno;
    result.errmsg = response.data.errmsg;
    result.data = response.data.data;

    return result;
}


/**
 * 封装get方法
 * @param url
 * @param params
 * @param customParams
 * @returns {Promise}
 */
// export function get(url, params = {}, customParams = {}) {
//     return new Promise((resolve, reject) => {
//         let config = {
//             params: params,
//             customParams: customParams
//         };
//         axios.get(url, config)
//             .then(response => {
//                 resolve(response.data);
//             })
//             .catch(err => {
//                 reject(err)
//             })
//     })
// }


/**
 * 封装post请求
 * @param url
 * @param data
 * @param customParams
 * @returns {Promise}
 */
// export function post(url, data = {}, customParams = {}) {
//     return new Promise((resolve, reject) => {
//         let config = {
//             customParams: customParams
//         };
//         axios.post(url, data, config)
//             .then(response => {
//                 resolve(response.data);
//             }, err => {
//                 reject(err)
//             })
//     })
// }

export default instance
