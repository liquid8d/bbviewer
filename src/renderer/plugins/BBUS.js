import Vue from 'vue'
import router from '../router'
import axios from 'axios'
import Plugins from '../mixins/Plugins'
import Utils from '../mixins/Utils'

import moment from 'moment'
import 'moment-timezone'

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
            angle: 5,
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
        PlayerEvents.$on('delayedseek', this.processDelayedSeek)
    },
    beforeDestroy () {
        PlayerEvents.$off('stop', this.stop)
        PlayerEvents.$off('switchAngle', this.switchAngle)
        PlayerEvents.$off('requestBookmarks', this.requestBookmarks)
        PlayerEvents.$off('loadBookmark', this.loadBookmark)
        PlayerEvents.$off('delayedseek', this.processDelayedSeek)
    },
    methods: {
        processDelayedSeek (event) {
            if (this.delayedSeek) {
                console.log('processing delayed seek: ' + this.delayedSeek)
                PlayerEvents.$emit('seekTo', this.delayedSeek)
                this.delayedSeek = null
            }
        },
        loadBookmark (bookmark) {
            // TODO seek if on same date and cam, if different request new token, then seek
            // TODO determine play date based on timestamp
            let bbt = moment(bookmark.liveDate * 1000).tz('America/Los_Angeles')
            let midnight = bbt.clone().startOf('day')
            let seek = bbt.unix() - midnight.unix()
            console.log('load bookmark for ' + bbt.format('MMDDYYYY') + ' seek: ' + seek)
            this.item.src.defaults = {
                month: bbt.format('MM'),
                day: bbt.format('DD'),
                year: bbt.format('YY'),
                seek: seek,
                angle: parseInt(bookmark.channel)
            }
            this.play(this.item)
            router.replace('/')
        },
        play (item) {
            this.item = item
            // set defaults if not found
            if (!item.src.defaults) {
                // use today (Los Angeles today)
                var bbt = moment().tz('America/Los_Angeles')
                item.src.defaults = {
                    month: bbt.format('MM'),
                    day: bbt.format('DD'),
                    year: bbt.format('YY'),
                    angle: 5
                }
            }

            // default angle
            this.angle = (item.src.defaults && item.src.defaults.angle) ? item.src.defaults.angle : 5
            PlayerEvents.$emit('anglechange', this.angle)

            // default seek
            this.delayedSeek = (item.src.defaults && item.src.defaults.seek) ? item.src.defaults.seek : 0

            if (item.src.useCBSMedia) {
                // get media data from CBS
                if (!item.src.defaults) {
                    this.getMedia('?d=0')
                } else {
                    this.getMedia('?year=' + item.src.defaults.year + '&month=' + ('0' + item.src.defaults.month).slice(-2) + '&day=' + ('0' + item.src.defaults.day).slice(-2))
                }
            } else {
                // use custom media data
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
            PlayerEvents.$emit('anglechange', angle)
        }
    }
})

export default BBUS
