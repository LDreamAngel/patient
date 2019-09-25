import req from '../request';

const im = {
    chat(params) {
        return req.get('/im/chat', {params: params});
    },
    msglist(params) {
        return req.get('/im/msglist', {params: params});
    },
    sendmsg(params) {
        return req.post('/im/sendmsg', req.qs.stringify(params));
    },
    unreadmsgnotice (id) {
        // console.log('测试' + id);
        if (id != 'undefined') {
            return req.get('/im/unreadmsgnotice', { params: { revisitsessionid: id } });
        } else {
            return req.get('/im/unreadmsgnotice')
        }
    },
};

export default im
