import req from '../request';

const revisitpaper = {
    list() {
        return req.get('/revisitpaper/list');
    },
    one (revisitpaperId) {
        let params = { revisitpaperid: revisitpaperId };
        return req.get('/revisitpaper/one',{ params: params });
    }
};

export default revisitpaper
