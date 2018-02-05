import Vue from 'vue'
import router from '../router'
import axios from 'axios'
import Plugins from '../mixins/Plugins'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const BBUS = new Vue({
    data () {
        return {
            id: 'bbuslf',
            title: 'Big Brother Live Feeds',
            desc: '',
            poster: 'static/media/bbus.jpg',
            cbsUrl: 'http://www.cbs.com',
            loginUrl: 'https://www.cbs.com/account/login/',
            mediaUrl: 'http://www.cbs.com/sites/big_brother/livefeed/bbmedia/',
            tokenUrl: 'http://www.cbs.com/shows/big_brother/live_feed/token.json?stream=[stream]',
            timeUrl: 'http://www.cbs.com/sites/big_brother/livefeed/bbtime/',
            cdn: 'akamaihd.net',
            item: null,
            angle: null,
            delayedSeek: null
        }
    },
    components: { PlayerEvents },
    mixins: [ Plugins ],
    router,
    created () {
        this.registerPlugin(this)
        PlayerEvents.$on('stop', this.stop)
        PlayerEvents.$on('switchAngle', this.switchAngle)
        PlayerEvents.$on('requestBookmarks', this.requestBookmarks)
    },
    beforeDestroy () {
        PlayerEvents.$off('stop', this.stop)
        PlayerEvents.$off('switchAngle', this.switchAngle)
        PlayerEvents.$off('requestBookmarks', this.requestBookmarks)
    },
    methods: {
        login (user, pass) {
            // this should trigger ui login, then redirect back to play
            // TODO use jsonp? gets error
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
                        axios.get(this.loginUrl)
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
        play (item) {
            this.item = item
            if (!this.angle) this.angle = (item.src.defaults) ? item.src.defaults.angle : 5
            if (item.src.useCBSMedia) {
                // get media data from CBS
                if (!item.src.defaults) {
                    this.getMedia('?d=0')
                    this.delayedSeek = 0
                } else {
                    if (!this.delayedSeek) this.delayedSeek = item.src.defaults.seek
                    this.getMedia('?year=' + item.src.defaults.year + '&month=' + ('0' + item.src.defaults.month).slice(-2) + '&day=' + ('0' + item.src.defaults.day).slice(-2))
                }
            } else {
                // use custom media data
                if (!item.src.defaults) {
                    // use today if no date specified
                    let today = new Date()
                    // TODO NEED MOMENT.JS
                    item.src.defaults = { month: ('0' + (today.getMonth() + 1)).slice(-2), day: ('0' + today.getDate()).slice(-2), year: today.getFullYear().toString().substr(-2) }
                }
                let dt = ('0' + item.src.defaults.month).slice(-2) + ('0' + item.src.defaults.day).slice(-2) + item.src.defaults.year.toString().substr(-2)
                let m = { cp: item.src.data.cp }
                for (var i = 1; i <= 6; i++) {
                    m['ch' + i] = { hls: 'BBLIVE' + dt + 'x' + item.src.data.codes[dt].id + '_' + this.angle + '@' + item.src.data.codes[dt].stream }
                }
                console.dir(m)
                this.getToken(m)
            }
        },
        stop () {
            this.item = null
        },
        getMedia (params) {
            // TODO use jsonp? gets error
            axios.get(this.mediaUrl)
                .then(response => {
                    if (response.data.error) {
                        console.error(response.data.error)
                    } else {
                        let stripped = response.data.replace('json_media(', '').replace(');', '').replace(/'/g, '"').replace('d:', '"d":').replace('n:', '"n":').replace('cp:', '"cp":').replace('ch1:', '"ch1":').replace('ch2:', '"ch2":').replace('ch3:', '"ch3":').replace('ch4:', '"ch4":').replace('ch5:', '"ch5":').replace('ch6:', '"ch6":').replace(/sync:/g, '"sync":').replace(/flash:/g, '"flash":').replace(/hls:/g, '"hls":')
                        this.getToken(JSON.parse(stripped))
                    }
                })
        },
        getToken (media) {
            console.log('token for cam ' + this.angle)
            let streamPath = media['ch' + this.angle].hls
            // TODO use jsonp? gets error
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
            PlayerEvents.$emit('provideAngles', this.item.src.angles)
        },
        requestBookmarks () {
            if (this.item.src && this.item.src.bookmarks) PlayerEvents.$emit('provideBookmarks', this.item.src.bookmarks)
        },
        switchAngle (angle) {
            this.angle = angle
            console.dir(this.item)
            this.play(this.item)
        }
    }
})

export default BBUS
