import req from '../request';

const login = {
    login(params) {
        return req.post('/login/login', req.qs.stringify(params));
    }
};

export default login
