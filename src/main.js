import Vue from 'vue'
import App from './App.vue'
import lodash from 'lodash';
// import './plugins/iview';
import './plugins/axios';
import numeral from 'numeral';
import router from './router';
import store from './store';
import './plugins/iview.js'

Vue.config.productionTip = false;

// 全局引入lodash库
window._ = lodash;
// 格式化数字
Vue.prototype.$numeral = numeral;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
