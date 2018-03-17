import VideoPlugin from '../mixins/Plugins'
import axios from 'axios'
import router from '../router'

const moment = require('moment-timezone')
const { PlayerEvents } = require('../components/Player/PlayerEvents')

const BBUS = new VideoPlugin({
    id: 'bbuslf',
    label: 'Big Brother Live Feeds',
    desc: 'Provide access to the Big Brother Live Feeds available on All Access',
    poster: 'static/media/bbus.jpg',
    config: {
        loginUrl: 'https://www.cbs.com/all-access/user/signin/',
        mediaUrl: 'http://www.cbs.com/sites/big_brother/livefeed/bbmedia/',
        tokenUrl: 'http://www.cbs.com/shows/big_brother/live_feed/token.json?stream=[stream]',
        authTitle: 'Login to All Access',
        authDesc: 'This content requires a subscription. Login into your account, then try accessing the content again',
        cdn: 'akamaihd.net',
        item: null,
        angle: 5,
        delayedSeek: null,
        midnight: 0
    },
    onUpdate (data) {
        // update video text and window title while playing
        let text
        try {
            let day = this.config.item.defaults.year + '-' + this.config.item.defaults.month + '-' + this.config.item.defaults.day
            this.midnight = moment(day, 'YYYY-MM-DD').tz('America/Los_Angeles').unix()
            let bbt = moment((this.midnight + data.currentTime) * 1000)
            text = bbt.format('MMM Do YYYY, h:mm:ss a')
        } catch (e) {
            text = ''
        }
        // this.setWindowTitle(text)
        PlayerEvents.$emit('videotext', text)
    },
    onRequestAngles () {
        PlayerEvents.$emit('provideAngles', this.config.item.src.angles)
    },
    switchAngle (angle) {
        this.config.angle = angle
        this.play(this.config.item)
    },
    onLoadedMetadata (event) {
        // process a delayed seek event
        if (this.config.delayedSeek) {
            console.log('processing delayed seek: ' + this.config.delayedSeek)
            PlayerEvents.$emit('seekTo', this.config.delayedSeek)
            this.config.delayedSeek = null
        }
    },
    onRequestBookmarks () {
        if (this.config.item && this.config.item.bookmarks) {
            axios.get(this.config.item.bookmarks).then(response => {
                PlayerEvents.$emit('provideBookmarks', response.data)
            })
        }
    },
    loadBookmark (bookmark) {
        // TODO seek if on same date and cam, if different request new token, then seek
        // TODO determine play date based on timestamp
        let bbt = moment(bookmark.liveDate * 1000).tz('America/Los_Angeles')
        let midnight = bbt.clone().startOf('day')
        let seek = bbt.unix() - midnight.unix()
        console.log('load bookmark for ' + bbt.format('MMDDYYYY') + ' seek: ' + seek)
        this.config.item.defaults = {
            month: bbt.format('MM'),
            day: bbt.format('DD'),
            year: bbt.format('YY'),
            seek: seek,
            angle: parseInt(bookmark.channel)
        }
        this.play(this.config.item)
        router.replace('/')
    },
    play (src) {
        console.log('BBUS play:')
        this.config.item = src
        // set defaults if not found
        if (!src.defaults) {
            // use today (Los Angeles today)
            var bbt = moment().tz('America/Los_Angeles')
            src.defaults = {
                month: bbt.format('MM'),
                day: bbt.format('DD'),
                year: bbt.format('YY'),
                angle: 5
            }
        }

        // default angle
        this.angle = (src.defaults && src.defaults.angle) ? src.defaults.angle : 5
        PlayerEvents.$emit('anglechange', this.angle)

        // default seek
        this.config.delayedSeek = (src.defaults && src.defaults.seek) ? src.defaults.seek : 0

        if (src.useCBSMedia) {
            // get media data from CBS
            if (!src.defaults) {
                this.getMedia('?d=0')
            } else {
                this.getMedia('?year=' + src.defaults.year + '&month=' + ('0' + src.defaults.month).slice(-2) + '&day=' + ('0' + src.defaults.day).slice(-2))
            }
        } else {
            // use custom media data
            let dt = ('0' + src.defaults.month).slice(-2) + ('0' + src.defaults.day).slice(-2) + src.defaults.year.toString().substr(-2)
            let m = { cp: src.data.cp }
            for (var i = 1; i <= 6; i++) {
                m['ch' + i] = { hls: 'BBLIVE' + dt + 'x' + src.data.codes[dt].id + '_' + this.config.angle + '@' + src.data.codes[dt].stream }
            }
            this.getToken(m)
        }
    },
    getMedia (params) {
        axios.get(this.config.mediaUrl)
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
        let streamPath = media['ch' + this.config.angle].hls
        axios.get(this.config.tokenUrl.replace('[stream]', streamPath))
            .then(response => {
                if (!response.data.success) {
                    console.error('error retrieving token, are you logged in?')
                    PlayerEvents.$emit('showNotice', {
                        title: '<font color="red">CBS Auth</font>',
                        desc: 'Login to All Access before watching this content',
                        action: 'route:/auth?url=' + this.config.loginUrl + '&title=' + this.config.authTitle + '&desc=' + this.config.authDesc,
                        actionTitle: 'Login'
                    })
                } else {
                    let token = response.data.token.replace('&hdcore=3.1', '')
                    this.playStream('http://' + media.cp + '.' + this.config.cdn + '/i/' + streamPath + '/master.m3u8?hdnea=' + token)
                }
            })
    },
    playStream (url) {
        PlayerEvents.$emit('play', url)
        // PlayerEvents.$emit('provideAngles', this.config.item.src.angles)
    },
    onStop () {
        this.config.item = null
    }
})

export default BBUS
