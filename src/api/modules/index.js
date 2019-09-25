import req from '../request';

const index = {
    index() {
        return req.get('/index/index');
    },
    getalldoctors(params) {
        return req.post('/index/getalldoctors', req.qs.stringify(params));
    }
};

export default index
