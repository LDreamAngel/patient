import req from '../request';

const register = {
    register(params) {
      return req.post('/register/register', req.qs.stringify(params));
    }
};

export default register
