import Vue from 'vue';
import App from './App';
import './assets/scss/common.scss';
import './plugins/ant-design';
import router from './router';
import Settings from '../utils/settings';

Vue.prototype.$bgSettings = Settings;
Vue.prototype.$bgUtils = {};
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
