import Vue from 'vue'
import axios from 'axios'
import Plugins from '../mixins/Plugins'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const Livestream = new Vue({
    data () {
        return {
            id: 'livestream',
            title: 'Livestream Media',
            desc: '',
            poster: 'static/media/livestream.jpg',
            handler: 'livestream',
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
        viewing_info (src) {
            // TODO jsonp support?
            axios.get(this.apiBase + '/accounts/' + src.account + '/events/' + src.event + '/viewing_info')
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
            this.viewing_info(item.src)
        }
    }
})

export default Livestream
