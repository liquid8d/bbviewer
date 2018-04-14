import VideoPlugin from '../mixins/Plugins'
import axios from 'axios'
import router from '../router'

const moment = require('moment-timezone')
const { PlayerEvents } = require('../components/Player/PlayerEvents')

const BBCAN = new VideoPlugin({
    id: 'bbcan',
    label: 'Big Brother Canada',
    desc: '',
    poster: 'static/media/bbcan.png',
    config: {
        item: null,
        angle: 1,
        enableSWF: true,
        currentTime: 0,
        duration: 0,
        playTime: 0,
        angles: [
            { id: 1, label: 'Cam 1', desc: 'Cam 1', click: function () { PlayerEvents.$emit('switchAngle', 1) } },
            { id: 2, label: 'Cam 2', desc: 'Cam 2', click: function () { PlayerEvents.$emit('switchAngle', 2) } },
            { id: 3, label: 'Cam 3', desc: 'Cam 3', click: function () { PlayerEvents.$emit('switchAngle', 3) } },
            { id: 4, label: 'Cam 4', desc: 'Cam 4', click: function () { PlayerEvents.$emit('switchAngle', 4) } }
        ],
        flashbacks: null,
        url: 'https://player-api.new.livestream.com/accounts/[account]/events/[event]/broadcasts/[broadcast].secure.m3u8?dw=14400&hdnea=[auth]'
    },
    isLiveStream () {
        return true
    },
    isPlayingLive () {
        if (this.currentTime === 0 || this.duration === 0) return false
        return this.duration - this.currentTime < 40
    },
    onUpdate (data) {
        // update video text and window title while playing
        let text
        try {
            this.currentTime = data.currentTime
            this.duration = data.duration
            // console.log(this.duration - this.currentTime)
            text = moment().tz('America/New_York').format('MMM Do YYYY, h:mm:ss a')
        } catch (e) {
            text = ''
        }
        // this.setWindowTitle(text)
        PlayerEvents.$emit('videotext', text)
    },
    onRequestAngles () {
        PlayerEvents.$emit('provideAngles', this.config.angles)
    },
    onStop () {
        this.config.item = null
    },
    switchAngle (angle) {
        this.config.angle = angle
        this.playLive()
    },
    loadBookmark (bookmark) {
        let bookmarkId = bookmark['event_id'].split(',')[0]
        console.log('looking for ' + bookmarkId)
        Object.keys(this.config.flashbacks).forEach((key) => {
            for (var i = 0; i < this.config.flashbacks[key].length; i++) {
                let id = this.config.flashbacks[key][i].id.split(',')[0]
                if (id === bookmarkId) {
                    let account = id.substr(0, id.indexOf('_'))
                    let event = id.substr(account.length + 1, 7)
                    let broadcast = this.config.flashbacks[key][i].bid
                    console.log('play ' + account + ',' + event + ',' + broadcast)
                    this.playBroadcast(account, event, broadcast)
                    break
                }
            }
        })
        console.dir(bookmark)
        router.replace('/')
    },
    onRequestBookmarks () {
        if (this.config.item && this.config.item.bookmarks) {
            axios.get(this.config.item.bookmarks).then(response => {
                PlayerEvents.$emit('provideBookmarks', response.data)
            })
        }
    },
    play (src) {
        this.config.item = src
        if (src.bitrates) {
            let levels = []
            for (let i = 0; i < src.bitrates.length; i++) {
                levels.push({ id: src.bitrates[i].id, label: src.bitrates[i].label, onclick: null })
            }
            PlayerEvents.$emit('provideLevels', levels)
        }
        let config = { headers: {'Cache-Control': 'no-cache'} }
        if (!this.config.flashbacks) {
            axios.get(src.flashbacks, config)
                .then(response => {
                    this.config.flashbacks = response.data
                    this.playLive()
                })
        } else {
            this.playLive()
        }
    },
    playLive () {
        // find most recent flashback entry for selected angle
        let id = this.config.flashbacks['cam' + this.config.angle][0].id
        let sid = this.config.flashbacks['cam' + this.config.angle][0].sid
        let quality = '3628'
        if (this.config.enableSWF) {
            // play using swf
            PlayerEvents.$emit('playSWF', {
                swf: this.config.item.swf,
                src: 'http://livestream-f.akamaihd.net/' + id + '_1_' + quality + '@' + sid + '?v=3.6.0&fp=WIN%2020,0,0,306&r=' + this.randomCacheString(5) + '&g=' + this.randomCacheString()
            })
        } else {
            // play hls broadcast
            let account = id.substr(0, id.indexOf('_'))
            let event = id.substr(id.indexOf('_') + 1, id.indexOf('_', id.indexOf('_')))
            let broadcast = this.config.flashbacks['cam' + this.config.angle][0].bid
            let path = this.config.flashbacks['cam' + this.config.angle][0].id + '@' + sid
            this.streamStartTime = parseFloat(this.config.flashbacks['cam' + this.config.angle][0].timestamp)
            this.playBroadcast(account, event, broadcast, path)
        }
    },
    getToken () {
        // generate a token to use for a broadcast
        var token = ''
        for (var i = 0; i < 64; i++) {
            var val = this.randomIntInc(0, 15)
            if (val === 10) val = 'a'; else if (val === 11) val = 'b'; else if (val === 12) val = 'c'; else if (val === 13) val = 'd'; else if (val === 14) val = 'e'; else if (val === 15) val = 'f'
            token += val
        }
        return token
    },
    playBroadcast (account, event, broadcast, path) {
        // play an hls broadcast from livestream
        let current = Math.floor(Date.now() / 1000)
        let expire = current + 1800
        let auth = 'st=[current]~exp=[expire]~acl=/i/[path]/*~hmac=' + this.getToken()
        auth = auth.replace('[current]', current).replace('[expire]', expire).replace('[path]', path)
        let url = this.config.url.replace('[account]', account).replace('[event]', event).replace('[broadcast]', broadcast).replace('[auth]', auth)
        console.log(url)
        PlayerEvents.$emit('play', url)
    },
    randomIntInc (low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low)
    },
    randomCacheString (count) {
        // get a random cache string
        if (!count) count = 12
        let cacheString = ''
        let counter = 0
        while (counter < count) {
            cacheString = cacheString + String.fromCharCode(65 + Math.round(Math.random() * 25))
            counter = counter + 1
        }
        return cacheString
    }
})

export default BBCAN
