import Vue from 'vue'
import api from '@/api'
import store from '@/store/index.js'

const timeout = 1000;
const im = {
    t: null,
    init() {
        console.warn('-----------------im init-----------------');
        let self = this;

        self.t = setInterval(() => self.polling(), timeout);
    },
    destroy() {
        console.warn('-----------------im destroy-----------------');
        let self = this;
        // self.init()
        clearInterval(self.t);
        self.t = null;
        
    },
    polling() {
        let self = this;

        if (!self.t) return;

        this.fetchData()
            .then((data) => self.dataDistribution(data))
    },
    fetchData() {
        // console.log('fetch data');
        return new Promise((resolve) =>
            api.im.unreadmsgnotice(store.state.revisitSessionId)
                .then(({data}) => resolve(data))
        );
    },
    emit(eventName, params) {
        Vue.prototype.$eventHub.$emit(eventName, params)
    },
    dataDistribution(data) {
        let self = this;

        Object.keys(data).forEach((key) => {
            let value = data[key];
            switch (key) {
                case "sessions":
                    self._sessions(value);
                    break;
                default:
                    console.warn('无法处理的数据：' + key);
                    break;
            }
        })
    },
    _sessions(sessions) {
        let self = this,
            total_cnt = 0,
            unread_msg_cnt = 0,
            sessionid = 0;

        sessions.forEach((item) => {
            sessionid = item.session_id;

            unread_msg_cnt = parseInt(item.unread_msg_cnt);
            // 先各自分发给对应的会话
            self.emit('session_' + sessionid, unread_msg_cnt);

            total_cnt += parseInt(unread_msg_cnt);

        });

        // 发送未读数通知广播
        self.emit('notice', {total_cnt, sessionid});
    }
};

export default im;
