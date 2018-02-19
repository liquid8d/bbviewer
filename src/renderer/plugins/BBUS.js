import Vue from 'vue'
import router from '../router'
import axios from 'axios'
import Plugins from '../mixins/Plugins'
import Utils from '../mixins/Utils'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const BBUS = new Vue({
    data () {
        return {
            id: 'bbuslf',
            title: 'Big Brother Live Feeds',
            desc: '',
            poster: 'static/media/bbus.png',
            cbsUrl: 'http://www.cbs.com',
            loginUrl: 'https://www.cbs.com/all-access/user/signin/',
            mediaUrl: 'http://www.cbs.com/sites/big_brother/livefeed/bbmedia/',
            tokenUrl: 'http://www.cbs.com/shows/big_brother/live_feed/token.json?stream=[stream]',
            timeUrl: 'http://www.cbs.com/sites/big_brother/livefeed/bbtime/',
            authTitle: 'Login to All Access',
            authDesc: 'This content requires a subscription. Login into your account, then try accessing the content again',
            cdn: 'akamaihd.net',
            item: null,
            angle: null,
            delayedSeek: null
        }
    },
    components: { PlayerEvents },
    mixins: [ Plugins, Utils ],
    router,
    created () {
        this.registerPlugin(this)
        PlayerEvents.$on('stop', this.stop)
        PlayerEvents.$on('switchAngle', this.switchAngle)
        PlayerEvents.$on('requestBookmarks', this.requestBookmarks)
        PlayerEvents.$on('loadBookmark', this.loadBookmark)
    },
    beforeDestroy () {
        PlayerEvents.$off('stop', this.stop)
        PlayerEvents.$off('switchAngle', this.switchAngle)
        PlayerEvents.$off('requestBookmarks', this.requestBookmarks)
        PlayerEvents.$off('loadBookmark', this.loadBookmark)
    },
    methods: {
        loadBookmark (bookmark) {
            // TODO seek if on same date and cam, if different request new token, then seek
            // TODO determine play date based on timestamp
            this.item.src.defaults = { month: bookmark.event_day.split('/')[0], day: bookmark.event_day.split('/')[1], year: bookmark.event_day.split('/')[2].substr(-2), seek: 0, angle: bookmark.channel }
            this.play(this.item)
            router.replace('/')
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
                    // TODO NEED MOMENT.JS
                    let today = new Date()
                    item.src.defaults = { month: ('0' + (today.getMonth() + 1)).slice(-2), day: ('0' + today.getDate()).slice(-2), year: today.getFullYear().toString().substr(-2) }
                }
                let dt = ('0' + item.src.defaults.month).slice(-2) + ('0' + item.src.defaults.day).slice(-2) + item.src.defaults.year.toString().substr(-2)
                let m = { cp: item.src.data.cp }
                for (var i = 1; i <= 6; i++) {
                    m['ch' + i] = { hls: 'BBLIVE' + dt + 'x' + item.src.data.codes[dt].id + '_' + this.angle + '@' + item.src.data.codes[dt].stream }
                }
                this.getToken(m)
            }
        },
        stop () {
            this.item = null
        },
        getMedia (params) {
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
            let streamPath = media['ch' + this.angle].hls
            this.fetchUrl(this.tokenUrl.replace('[stream]', streamPath), {
                json: true,
                complete: response => {
                    if (!response.data.success) {
                        console.error('error retrieving token, are you logged in?')
                        // route to authenticate
                        router.push('/auth?url=' + this.loginUrl + '&title=' + this.authTitle + '&desc=' + this.authDesc)
                    } else {
                        let token = response.data.token.replace('&hdcore=3.1', '')
                        console.log('got token: ' + token)
                        this.playStream('http://' + media.cp + '.' + this.cdn + '/i/' + streamPath + '/master.m3u8?hdnea=' + token)
                    }
                }
            })
        },
        playStream (url) {
            PlayerEvents.$emit('play', url)
            PlayerEvents.$emit('provideAngles', this.item.src.angles)
        },
        requestBookmarks () {
            if (this.item && this.item.src && this.item.src.bookmarks) {
                axios.get(this.item.src.bookmarks).then(response => {
                    PlayerEvents.$emit('provideBookmarks', response.data)
                })
            }
        },
        switchAngle (angle) {
            this.angle = angle
            this.play(this.item)
        }
    }
})

export default BBUS
