
const setUser = ({commit}, user) => {
    commit("updateUserStatus", user);
};
const updateRevisitSessionId = ({ commit }, id) => {
    commit('updateRevisitSessionId', id)
}

export default {
    setUser,
    updateRevisitSessionId
}
