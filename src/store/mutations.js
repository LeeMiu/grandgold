const mutations = {
  setUserInfo(state, payload) {
    state.user_name = payload.user_name;
    state.user_token = payload.user_token;
    state.user_id = payload.user_uuid;
    state.user_companyId = payload.user_companyId;
  },
  cleanUserInfo(state) {
    state.user_name = '';
    state.user_id = '';
    state.user_token = '';
    state.user_uuid = '';
  },
};

export default mutations;
