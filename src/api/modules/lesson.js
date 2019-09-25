import req from '../request';

const lesson = {
    list(params) {
        return req.post('/lesson/list', req.qs.stringify(params));
    },
    one(params) {
        return req.post('/lesson/one', req.qs.stringify(params));
    },
};

export default lesson
