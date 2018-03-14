import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import i18n from './i18n'

import ExtendedInput from './plugins/VueExtendedInput'
import chromecast from './plugins/Chromecast'

Vue.use(ExtendedInput)
Vue.use(chromecast)

// check environments
store.state.environment = process.env.NODE_ENV
if (!process.env.IS_WEB) {
    Vue.use(require('vue-electron'))
    store.commit('isElectron', true)
} else {
    store.commit('isElectron', false)
}
store.commit('lastRun')

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

const globals = {
    player: null
}
Vue.globals = Vue.prototype.$globals = globals

/* eslint-disable no-new */
new Vue({
    components: { App },
    i18n,
    router,
    store,
    template: '<App/>'
}).$mount('#app')
