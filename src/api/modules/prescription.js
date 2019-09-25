import req from '../request';

const prescription = {
    list(params) {
        return req.get('/prescription/list', {params: params});
    },
    one(prescriptionid) {
        let params = {prescription_id: prescriptionid};
        return req.get('/prescription/one', {params: params});
    }
};

export default prescription
