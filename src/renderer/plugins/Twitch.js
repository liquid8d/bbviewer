import Vue from 'vue'
import VideoPlugin from '../mixins/Plugins'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const Twitch = new Vue({
    extends: VideoPlugin,
    data () {
        return {
            id: 'twitch.tv',
            title: 'Twitch.TV',
            desc: '',
            poster: '',
            handler: 'twitch.tv'
        }
    },
    components: { PlayerEvents },
    created () {
        this.registerPlugin(this)
    },
    methods: {
        play (src) {

        }
    }
})

export default Twitch
