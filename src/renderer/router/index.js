import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', name: 'home', component: require('@/components/Home').default },
        { path: '/about', name: 'about', component: require('@/components/About').default },
        { path: '/auth', name: 'auth', component: require('@/components/Auth').default },
        { path: '/browse', name: 'browse', component: require('@/components/Browse').default },
        { path: '/bookmarks', name: 'bookmarks', component: require('@/components/Bookmarks').default },
        { path: '/cast', name: 'cast', component: require('@/components/Cast').default },
        { path: '/donate', name: 'donate', component: require('@/components/Donate').default },
        { path: '/flashbacks', name: 'flashbacks', component: require('@/components/Flashbacks').default },
        { path: '/flashcheck', name: 'flashcheck', component: require('@/components/FlashCheck').default },
        { path: '/menu', name: 'menu', component: require('@/components/Menu').default },
        { path: '/notifications', name: 'notifications', component: require('@/components/Notifications/Notifications').default },
        { path: '/settings', name: 'settings', component: require('@/components/Settings').default },
        { path: '*', redirect: '/' }
    ]
})
