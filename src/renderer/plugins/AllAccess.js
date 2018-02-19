import Vue from 'vue'
import router from '../router'
import axios from 'axios'
import Plugins from '../mixins/Plugins'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const AllAccessPlugin = new Vue({
    data () {
        return {
            id: 'allaccess',
            title: 'CBS All Access',
            desc: 'Watch All Access content with your CBS subscription',
            poster: 'static/media/allaccess.png',
            apiUrl: 'https://www.cbs.com',
            loginUrl: 'https://www.cbs.com/all-access/user/signin/',
            authTitle: 'Login to All Access',
            authDesc: 'This content requires a subscription. Login into your account, then try accessing the content again',
            pidUrl: 'http://link.theplatform.com/s/dJ5BDC/[pid]?format=SMIL&manifest=m3u&Tracking=true&mbr=true&sig=[sig]'
        }
    },
    components: { PlayerEvents },
    mixins: [ Plugins ],
    router,
    created () {
        this.registerPlugin(this)
        console.log('AllAccess plugin initialized')
    },
    methods: {
        play (item) {
            this.requestPage(this.apiUrl + item.src.url)
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
                        router.push('/auth?url=' + this.loginUrl + '&title=' + this.authTitle + '&desc=' + this.authDesc)
                    }
                })
        },
        playStream (pid, sig) {
            let url = this.pidUrl.replace('[pid]', pid).replace('[sig]', sig)
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
    }
})

export default AllAccessPlugin
