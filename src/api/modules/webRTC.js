import req from '../request';

const webRTC = {
    createsessionid() {
        return req.get('https://ccapi.csslcloud.net/api/room/create/sessionid');
    }
};

export default webRTC