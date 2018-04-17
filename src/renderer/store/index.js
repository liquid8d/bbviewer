import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        version: '6.0.0',
        lastRun: 0,
        isElectron: false,
        locales: [
            { id: 'en', label: 'English' },
            { id: 'es', label: 'Spanish' }
        ],
        plugins: {},
        config: {
            locale: 'en',
            build: 'release',
            debug: false,
            dragWindow: false,
            hideLeave: true,
            hideDelay: true,
            hideTimeout: 4000,
            screenshotFolder: ''
        },
        notifications: [],
        bookmarks: []
    },
    modules,
    mutations: {
        isElectron (state, val) {
            state.isElectron = val
        },
        lastRun (state) {
            state.lastRun = Date.now()
        },
        bookmarks (state, val) {
            state.bookmarks = val
        },
        plugin (state, plugin) {
            if (state.plugins[plugin.id]) {
                console.warn('plugin ' + this.id + ' already exists, overwriting!')
            }
            state.plugins[plugin.id] = plugin
        },
        loadConfig (state, payload) {
            state.config = payload
        },
        saveConfig (state, payload) {
            if (Array.isArray(payload)) {
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i].key && typeof payload.value !== 'undefined') state.config[payload[i].key] = payload[i].value
                }
            } else if (payload.key && typeof payload.value !== 'undefined') {
                state.config[payload.key] = payload.value
            }
            localStorage.setItem('config', JSON.stringify(state.config))
        }
    },
    strict: process.env.NODE_ENV !== 'production'
})
