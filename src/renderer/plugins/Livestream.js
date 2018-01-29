import Vue from 'vue'
import axios from 'axios'
import Plugins from '../mixins/Plugins'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const Livestream = new Vue({
    data () {
        return {
            id: 'livestream',
            handler: 'livestream',
            title: 'Livestream',
            desc: '',
            poster: 'https://cdn.livestream.com/deploy/website/production/3b2cdae/assets/livestream-ogimage.jpg',
            src: { account: 'berrynest1', event: '4299357' },
            apiBase: 'http://api.new.livestream.com'
        }
    },
    components: { PlayerEvents },
    mixins: [ Plugins ],
    created () {
        this.registerPlugin(this)
    },
    methods: {
        viewing_info (stream) {
            axios.get(this.apiBase + '/accounts/' + stream.account + '/events/' + stream.event + '/viewing_info')
                .then(response => {
                    if (response.data.streamInfo && response.data.streamInfo.secure_m3u8_url) {
                        PlayerEvents.$emit('play', response.data.streamInfo.secure_m3u8_url)
                    } else {
                        console.error('stream not available')
                    }
                })
        },
        play (stream) {
            this.viewing_info(stream)
        }
    }
})

export default Livestream
