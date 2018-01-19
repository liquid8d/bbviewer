import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import i18n from './i18n'

if (!process.env.IS_WEB) {
    Vue.use(require('vue-electron'))
    store.state.isElectron = true
}

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    components: { App },
    i18n,
    router,
    store,
    template: '<App/>'
}).$mount('#app')
