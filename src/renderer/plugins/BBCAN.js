import Vue from 'vue'
import axios from 'axios'
import Plugins from '../mixins/Plugins'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const BBCAN = new Vue({
    data () {
        return {
            id: 'bbcan',
            handler: 'bbcan',
            title: 'Big Brother Canada',
            desc: '',
            poster: 'static/media/bbcan.png',
            api: {
                base: 'http://api.new.livestream.com'
            }
        }
    },
    components: { PlayerEvents },
    mixins: [ Plugins ],
    created () {
        this.registerPlugin(this)
    },
    methods: {
        viewing_info (account, event) {
            axios.get(this.api.base + '/accounts/' + account + '/events/' + event + '/viewing_info')
                .then(response => {
                    if (response.data.streamInfo && response.data.streamInfo.secure_m3u8_url) {
                        PlayerEvents.$emit('play', response.data.streamInfo.secure_m3u8_url)
                    } else {
                        console.error('stream not available')
                        console.dir(response)
                    }
                })
        },
        play (item) {
            this.viewing_info(item.src.account, item.src.event)
        }
    }
})

export default BBCAN
