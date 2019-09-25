
const updateUserStatus = (state, user) => {
    if (user) {
        state.currentUser = user;
        state.isLogin = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLogin', true);
    } else if (user === null) {
        // 清空本地存储
        localStorage.setItem('token', '');
        localStorage.setItem('currentUser', '');
        localStorage.setItem('isLogin', '');
        state.currentUser = null;
        state.isLogin = false;
    }
};

const updateNoticeCnt = (state, {total_cnt, sessionid}) => {
    state.notice.cnt = total_cnt;
    state.notice.sessionid = sessionid;
};
const updateRevisitSessionId = (state, id) => {
    state.revisitSessionId = id;
    // console.log('id是'+id)
};

export default {
    updateUserStatus,
    updateNoticeCnt,
    updateRevisitSessionId
}
