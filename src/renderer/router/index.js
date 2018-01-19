import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', name: 'home', component: require('@/components/Home').default },
        { path: '/about', name: 'about', component: require('@/components/About').default },
        { path: '/dev', name: 'dev', component: require('@/components/Dev').default },
        { path: '/settings', name: 'settings', component: require('@/components/Settings').default },
        { path: '*', redirect: '/' }
    ]
})
