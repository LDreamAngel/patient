import req from '../request';

const patient = {
    info() {
        return req.get('/patient/info');
    },
    modifypost(params) {
        return req.post('patient/modifypost', req.qs.stringify(params));
    }
};

export default patient
