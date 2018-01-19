import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

var messages = {
    en: {
        welcome: 'Welcome to BBViewer',
        about: 'About',
        back: 'Back',
        settings: 'Settings',
        doc: `electron-vue comes packed with detailed documentation that covers everything from
        internal configurations, using the project structure, building your application,
        and so much more.`
    }
}

export default new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages
})
