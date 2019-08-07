import Vue from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue from 'bootstrap-vue'
//import 'bootstrap'; // Import js file
//import 'bootstrap/dist/css/bootstrap.min.css'; // Import css file
import 'css-toggle-switch/dist/toggle-switch.css';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faBook, faBolt, faCar, faCat, faCrow, faFeatherAlt, faHippo, faOilCan } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faCodepen, faEarlybirds, faFirefox } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add( faQuestionCircle, faBook, faBolt, faCar, faCat, faCrow, faFeatherAlt, faHippo, faOilCan, faPaperPlane,
  faCodepen, faEarlybirds, faFirefox);
dom.watch();
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.use(BootstrapVue)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
