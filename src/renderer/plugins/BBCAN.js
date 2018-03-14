import VideoPlugin from '../mixins/Plugins'
import axios from 'axios'
import router from '../router'

import moment from 'moment'
import 'moment-timezone'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const BBCAN = new VideoPlugin({
    id: 'bbcan',
    label: 'Big Brother Canada',
    desc: '',
    poster: 'static/media/bbcan.png',
    config: {
        item: null,
        angle: 1,
        angles: [
            { id: 1, label: 'Cam 1', desc: 'Cam 1', click: function () { PlayerEvents.$emit('switchAngle', 1) } },
            { id: 2, label: 'Cam 2', desc: 'Cam 2', click: function () { PlayerEvents.$emit('switchAngle', 2) } },
            { id: 3, label: 'Cam 3', desc: 'Cam 3', click: function () { PlayerEvents.$emit('switchAngle', 3) } },
            { id: 4, label: 'Cam 4', desc: 'Cam 4', click: function () { PlayerEvents.$emit('switchAngle', 4) } }
        ],
        flashbacks: null,
        url: 'https://api.new.livestream.com/accounts/[account]/events/[event]/broadcasts/[broadcast].secure.m3u8?dw=80'
    },
    onUpdate (data) {
        // update video text and window title while playing
        let text
        try {
            text = moment().tz('America/New_York').format('MMM Do YYYY, h:mm:ss a')
        } catch (e) {
            text = ''
        }
        // this.setWindowTitle(text)
        PlayerEvents.$emit('videotext', text)
    },
    onRequestAngles () {
        console.log('providing angles')
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
                    this.playStream(account, event, broadcast)
                    // let temp = 'https://secure-playlist.livestream.com/streams/6388794_8036524_lsi1jy09uadbajvt66w_1/media/6388794_8036524_lsi1jy09uadbajvt66w_1@3628000p.m3u8'
                    // TODO seek
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
        console.log('handler play')
        this.config.item = src
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
        // play most recent flashback for current angle
        let id = this.config.flashbacks['cam' + this.config.angle][0].id
        let account = id.substr(0, id.indexOf('_'))
        let event = id.substr(id.indexOf('_') + 1, id.indexOf('_', id.indexOf('_')))
        let broadcast = this.config.flashbacks['cam' + this.config.angle][0].bid
        this.playStream(account, event, broadcast)
    },
    playStream (account, event, broadcast) {
        let token = '' // 'st=1490444575~exp=1490446375~acl=/i/6388794_7139268_lsimpfq3zwjsfg18cy9_1@408465/*~hmac=08b6cb46bbcbc05eae4eff754ebe34279b9c533ce057ad88e3f575c1aefce130'
        let url = this.config.url.replace('[account]', account).replace('[event]', event).replace('[broadcast]', broadcast).replace('[token]', token)
        console.log(url)
        PlayerEvents.$emit('play', url)
        PlayerEvents.$emit('supportsBookmarks')
    }
})

export default BBCAN
