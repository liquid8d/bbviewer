import VideoPlugin from '../mixins/Plugins'
import axios from 'axios'
import router from '../router'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const AllAccessPlugin = new VideoPlugin({
    id: 'allaccess',
    label: 'CBS All Access',
    desc: 'Watch All Access content with your CBS subscription',
    poster: 'static/media/allaccess.png',
    config: {
        cbsUrl: 'https://www.cbs.com',
        loginUrl: 'https://www.cbs.com/all-access/user/signin/',
        authTitle: 'Login to All Access',
        authDesc: 'This content requires a subscription. Login into your account, then try accessing the content again',
        pidUrl: 'http://link.theplatform.com/s/dJ5BDC/[pid]?format=SMIL&manifest=m3u&Tracking=true&mbr=true&sig=[sig]'
    },
    play (src) {
        this.requestPage(this.config.cbsUrl + src.url)
    },
    requestPage (url) {
        axios.get(url)
            .then(response => {
                let pid
                let sig
                let pidStart = response.data.indexOf('{"pid":"')
                let sigStart = response.data.indexOf('"signature":"')
                if (pidStart > -1 && sigStart > -1) {
                    pidStart += 8
                    sigStart += 13
                    pid = response.data.substring(pidStart, response.data.indexOf('"', pidStart))
                    sig = response.data.substring(sigStart, response.data.indexOf('"', sigStart))
                    console.log('got ' + pid + ' ' + sig)
                    this.playStream(pid, sig)
                } else {
                    console.error('could not find token, are you logged in?')
                    // route to authenticate
                    router.push('/auth?url=' + this.config.loginUrl + '&title=' + this.config.authTitle + '&desc=' + this.config.authDesc)
                }
            })
    },
    playStream (pid, sig) {
        let url = this.config.pidUrl.replace('[pid]', pid).replace('[sig]', sig)
        axios.get(url)
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

export default AllAccessPlugin
