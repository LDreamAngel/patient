import req from '../request';

const revisitsession = {
    listforrevisit (data) {
        return req.get('/revisitsession/listforrevisit', { params: data});
    },
    listforrtcrevisit() {
        return req.get('/revisitsession/listforrtcrevisit');
    },
    applypost(params) {
        return req.post('/revisitsession/applypost', req.qs.stringify(params));
    },
    canrevisit(params) {
        return req.post('/revisitsession/canrevisit', req.qs.stringify(params));
    },
    cancelsession(params) {
        return req.post('/revisitsession/cancelsession', req.qs.stringify(params));
    },
    beginsession(params) {
        return req.post('revisitsession/beginsession', req.qs.stringify(params));
    },
    getapply (params) {
        return req.post('revisitsession/getapply', req.qs.stringify(params));
    }
};

export default revisitsession
