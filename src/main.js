import Vue from 'vue'
import App from './App.vue'
import lodash from 'lodash';
// import './plugins/iview';
import './plugins/axios';
import numeral from 'numeral';
import router from './router';
import store from './store';
import "iview/dist/styles/iview.css";
import './plugins/iview.js';
import VueI18n from 'vue-i18n';
import zhLocale from 'iview/src/locale/lang/zh-CN';
import enLocale from 'iview/src/locale/lang/en-US';
import twLocale from 'iview/src/locale/lang/zh-TW';
import cn from './language//zh-CN';
import tw from './language/zh-TW';
import us from './language/en-US';


Vue.config.productionTip = false;

// 全局引入lodash库
window._ = lodash;
// 格式化数字
Vue.prototype.$numeral = numeral;
Vue.use(VueI18n);
Vue.locale = () => {};

const messages = {
  zh: Object.assign(cn, zhLocale),
  en: Object.assign(us, enLocale),
  tc: Object.assign(tw, twLocale)
};

// 设置参数，创建 Vuei18n 的实例。
const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'zh', // set locale
  messages // set locale messages
});
new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
