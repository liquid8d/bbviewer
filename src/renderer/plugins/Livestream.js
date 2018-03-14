import VideoPlugin from '../mixins/Plugins'
import axios from 'axios'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const Livestream = new VideoPlugin({
    id: 'livestream',
    label: 'Livestream Media',
    desc: '',
    poster: 'static/media/livestream.jpg',
    config: {
        apiBase: 'http://api.new.livestream.com'
    },
    play (src) {
        this.viewing_info(src.account, src.event)
    },
    viewing_info (account, event) {
        // TODO jsonp support?
        axios.get(this.config.apiBase + '/accounts/' + account + '/events/' + event + '/viewing_info')
            .then(response => {
                if (response.data.streamInfo && response.data.streamInfo.secure_m3u8_url) {
                    PlayerEvents.$emit('play', response.data.streamInfo.secure_m3u8_url)
                } else {
                    console.error('stream not available')
                    console.dir(response)
                }
            })
    }
})

export default Livestream
