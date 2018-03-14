import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        locale: 'en',
        version: '6.0.0',
        build: 'stable',
        lastRun: 0,
        isElectron: false,
        plugins: {},
        notifications: []
    },
    modules,
    mutations: {
        addPlugin (state, plugin) {
            if (state.plugins[plugin.id]) {
                console.warn('plugin ' + this.id + ' already exists, overwriting!')
            }
            state.plugins[plugin.id] = plugin
        },
        isElectron (state, val) {
            state.isElectron = val
        },
        lastRun (state) {
            state.lastRun = Date.now()
        }
    },
    strict: process.env.NODE_ENV !== 'production'
})
