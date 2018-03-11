import Vue from 'vue'
import axios from 'axios'
import store from '../../store'
export const NotifyEvents = new Vue({
    data: {
        notificationTimer: null,
        frequency: 60000
    },
    methods: {
        init () {
            // this.notificationTimer = setInterval(this.retrieve, this.frequency)
        },
        retrieve () {
            console.log('update notifications: ' + Date.now())
            axios.get(store.state.urls.notify)
                .then(response => {
                    console.dir(response.data)
                    store.commit('notifications', store.state, response.data.notifications)
                    console.dir(store.state.notifications)
                })
        }
    }
})
