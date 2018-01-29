import Vue from 'vue'
import Plugins from '../mixins/Plugins'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const Twitch = new Vue({
    data () {
        return {
            id: 'twitch.tv',
            handler: 'twitch.tv',
            title: 'Twitch.TV',
            desc: '',
            src: '',
            poster: 'https://www.twitch.tv/p/assets/uploads/combologo_474x356.png'
        }
    },
    components: { PlayerEvents },
    mixins: [ Plugins ],
    created () {
        this.registerPlugin(this)
    },
    methods: {
        play (src) {

        }
    }
})

export default Twitch
