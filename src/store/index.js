import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex);

const index = new Vuex.Store({
    state: {
        currentUser: null,
        isLogin: false,
        notice: {
            cnt: 0,
            sessionid: 0,
        },
        revisitSessionId: 0
    },
    getters,
    mutations,
    actions,
});

export default index;
