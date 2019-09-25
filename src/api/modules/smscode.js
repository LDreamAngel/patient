import req from '../request';

const smscode = {
  sendcheckcode (params) {
    return req.post('http://www.fangcunhulian.com/smscode/sendcheckcode', req.qs.stringify(params));
  }
};

export default smscode