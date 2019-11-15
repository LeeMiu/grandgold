import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import * as actions from './actions';
// import moduleUser from './modules/user/index';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    // moduleUser,
  },
  state: {
      // 存放公共页面所需要的关键数据
  },
  mutations,
  actions,
});
