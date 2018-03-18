import VideoPlugin from '../mixins/Plugins'

const jsonp = require('jsonp')
const moment = require('moment-timezone')
const { PlayerEvents } = require('../components/Player/PlayerEvents')

const UtopiaNLPlugin = new VideoPlugin({
    id: 'utopia-nl',
    label: 'Utopia NL Live',
    desc: '',
    poster: 'static/media/utopia.png',
    src: {
        id: 'stream_live_1'
    },
    config: {
        llToken: null,
        llExpire: 0,
        authToken: null,
        platform: 'web',
        urlLongLived: 'https://token.utopiatv.nl/api/2/GetLongLivedAuthToken/?authToken=&_=[timestamp]',
        urlAuthToken: 'https://token.utopiatv.nl/api/2/GetToken/?authToken=[authToken]&streamKey=[stream]&platform=[platform]&_=[timestamp]'
    },
    init () {
        console.log('Utopia handler initialized')
    },
    play (src) {
        // play path
        if (!this.config.llToken || this.config.llExpires < Date.now()) {
            // fetch a new long lived token
            this.fetchLLToken(this.config.urlLongLived.replace('[timestamp]', Date.now()), src.id)
        } else {
            // have long lived token, just need auth token for this stream
            this.fetchAuthToken(src.id)
        }
    },
    onUpdate (data) {
        // update video text and window title while playing
        let text
        try {
            text = moment().tz('Europe/Amsterdam').format('MMM Do YYYY, h:mm:ss a')
        } catch (e) {
            text = ''
        }
        // this.setWindowTitle(text)
        PlayerEvents.$emit('videotext', text)
    },
    fetchLLToken (url, id) {
        jsonp(url, null, (err, data) => {
            if (err) {
                console.error('long lived token request not successful: ' + err)
            } else {
                this.config.llToken = data.authToken
                this.config.llExpire = data.time
                this.fetchAuthToken(id)
            }
        })
    },
    fetchAuthToken (id) {
        var url = this.config.urlAuthToken.replace('[authToken]', this.config.llToken)
            .replace('[stream]', id)
            .replace('[platform]', this.config.platform)
            .replace('[timestamp', Date.now())
        jsonp(url, null, (err, data) => {
            if (err) {
                console.error('auth token request not successful')
            } else {
                this.config.authToken = data.token
                PlayerEvents.$emit('play', data.url + '&dw=20')
                // this.setWindowTitle(this.title)
            }
        })
    }
})

export default UtopiaNLPlugin
