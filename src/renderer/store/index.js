import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        locale: 'en',
        version: '6.0.0',
        build: 'stable',
        plugins: {}
    },
    modules,
    strict: process.env.NODE_ENV !== 'production'
})
