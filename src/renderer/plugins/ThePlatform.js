import VideoPlugin from '../mixins/Plugins'
import axios from 'axios'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const ThePlatform = new VideoPlugin({
    id: 'theplatform',
    label: 'The Platform',
    desc: '',
    poster: '',
    config: {
        apiBase: 'http://link.theplatform.com/s/[account]/[id]?MBR=TRUE&manifest=m3u&formats=mpeg4,m3u&format=SMIL&embedded=true&tracking=true'
    },
    play (src) {
        this.parseSMIL(src.account, src.id)
    },
    parseSMIL (account, id) {
        axios.get(this.config.apiBase.replace('[account]', account).replace('[id]', id))
            .then(response => {
                try {
                    let parser = new DOMParser()
                    let xml = parser.parseFromString(response.data, 'text/xml')
                    let vid = xml.getElementsByTagName('video')[0]
                    let src = vid.getAttribute('src')
                    console.log('playing video')
                    PlayerEvents.$emit('play', src)
                } catch (e) {
                    console.error('error playing video')
                }
            })
    }
})

export default ThePlatform
