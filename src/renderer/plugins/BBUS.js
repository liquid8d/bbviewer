import Vue from 'vue'
import router from '../router'
import axios from 'axios'
import Plugins from '../mixins/Plugins'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const BBUS = new Vue({
    data () {
        return {
            id: 'bbus',
            handler: 'bbus',
            title: 'CBS Big Brother',
            desc: '',
            src: { year: 2017, month: 6, day: 29 },
            poster: 'http://www.canyon-news.com/wp-content/uploads/2017/06/Big-Brother.jpg',
            cbsUrl: 'http://www.cbs.com',
            loginUrl: 'https://www.cbs.com/account/login/',
            mediaUrl: 'http://www.cbs.com/sites/big_brother/livefeed/bbmedia/',
            tokenUrl: 'http://www.cbs.com/shows/big_brother/live_feed/token.json?stream=[stream]',
            timeUrl: 'http://www.cbs.com/sites/big_brother/livefeed/bbtime/',
            cdn: 'akamaihd.net',
            cam: 5,
            delayedSeek: 0
        }
    },
    components: { PlayerEvents },
    mixins: [ Plugins ],
    router,
    created () {
        this.registerPlugin(this)
    },
    methods: {
        login (user, pass) {
            // this should trigger ui login, then redirect back to play
            axios.get(this.cbsUrl)
                .then(response => {
                    // get login token
                    let loginTokenStart = response.data.indexOf('CBS.Registry.login.authToken')
                    if (loginTokenStart === -1) {
                        console.error('couldn\'t login to CBS site')
                    } else {
                        let loginTokenEnd = response.data.indexOf('\';', loginTokenStart)
                        let token = response.data.substring(loginTokenStart + 32, loginTokenEnd)
                        // do login
                        let formData = new FormData()
                        formData.append('j_username', user)
                        formData.append('j_password', pass)
                        formData.append('tk_trp', token)
                        axios.post(this.loginUrl, formData)
                            .then(response => {
                                if (response.data.success) {
                                    console.log('you are logged in!')
                                } else {
                                    console.error('error logging in: ' + response.data.message)
                                }
                            })
                    }
                })
        },
        play (params) {
            this.getMedia('?year=' + params.year + '&month=' + ('0' + params.month).slice(-2) + '&day=' + ('0' + params.day).slice(-2))
        },
        getMedia (params) {
            axios.get(this.mediaUrl + params)
                .then(response => {
                    let stripped = response.data.replace('json_media(', '').replace(');', '').replace(/'/g, '"').replace('d:', '"d":').replace('n:', '"n":').replace('cp:', '"cp":').replace('ch1:', '"ch1":').replace('ch2:', '"ch2":').replace('ch3:', '"ch3":').replace('ch4:', '"ch4":').replace('ch5:', '"ch5":').replace('ch6:', '"ch6":').replace(/sync:/g, '"sync":').replace(/flash:/g, '"flash":').replace(/hls:/g, '"hls":')
                    this.getToken(JSON.parse(stripped))
                })
        },
        getToken (media) {
            let streamPath = media['ch' + this.cam].hls
            axios.get(this.tokenUrl.replace('[stream]', streamPath))
                .then(response => {
                    if (response.data.success) {
                        let token = response.data.token.replace('&hdcore=3.1', '')
                        this.playStream('http://' + media.cp + '.' + this.cdn + '/i/' + streamPath + '/master.m3u8?hdnea=' + token)
                    } else {
                        console.log('you are not logged in')
                    }
                })
        },
        playStream (url) {
            PlayerEvents.$emit('play', url)
        }
    }
})

export default BBUS
