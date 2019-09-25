import Vue from 'vue'
import App from './App'
import router from './router'
import api from './api'
import store from './store'


import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)



//定义全局变量
Vue.prototype.$api = api;
Vue.prototype.$store = store;
Vue.prototype.$eventHub = new Vue(); // 全局事件处理器;

if (localStorage.getItem('currentUser') && localStorage.getItem('token')) {
    store.commit('updateUserStatus', JSON.parse(localStorage.getItem('currentUser')));
}

//可进行按需引入
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vfilter from "./filters";

Vue.use(Element);

Object.keys(vfilter).forEach(k => Vue.filter(k, vfilter[k]));
// for (let key in vfilter) {
//     Vue.filter(key, vfilter[key]);
// }

/** 在webpack entry里已经添加，暂时先注掉，如果webpack entry里的不好使，再打开此处
 //浏览器解析js兼容
 // import 'babel-polyfill'
 */

//阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
}).$mount('#app');

