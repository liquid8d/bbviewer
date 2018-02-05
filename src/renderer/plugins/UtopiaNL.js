import Vue from 'vue'
import Plugins from '../mixins/Plugins'

const jsonp = require('jsonp')
const { PlayerEvents } = require('../components/Player/PlayerEvents')

const UtopiaNLPlugin = new Vue({
    data () {
        return {
            id: 'utopia-nl',
            title: 'Utopia NL',
            desc: '',
            poster: 'static/media/utopia.png',
            handler: 'utopia-nl',
            src: 'stream_live_1',
            llToken: null,
            llExpire: 0,
            authToken: null,
            platform: 'web',
            urlLongLived: 'https://token.utopiatv.nl/api/2/GetLongLivedAuthToken/?authToken=&_=[timestamp]',
            urlAuthToken: 'https://token.utopiatv.nl/api/2/GetToken/?authToken=[authToken]&streamKey=[stream]&platform=[platform]&_=[timestamp]'
        }
    },
    components: { PlayerEvents },
    mixins: [ Plugins ],
    created () {
        console.log('Utopia NL plugin ready')
        this.registerPlugin(this)
    },
    methods: {
        init () {
            console.log('Utopia NL plugin initialized')
        },
        browse (path) {
            // return browseable content
        },
        play (item) {
            // play path
            if (!this.llToken || this.llExpires < Date.now()) {
                // fetch a new long lived token
                this.fetchLLToken(this.urlLongLived.replace('[timestamp]', Date.now()), item.src)
            } else {
                // have long lived token, just need auth token for this stream
                this.fetchAuthToken(item.src)
            }
        },
        fetchLLToken (url, id) {
            jsonp(url, null, (err, data) => {
                if (err) {
                    console.error('long lived token request not successful: ' + err)
                } else {
                    this.llToken = data.authToken
                    this.llExpire = data.time
                    this.fetchAuthToken(id)
                }
            })
        },
        fetchAuthToken (id) {
            var url = this.urlAuthToken.replace('[authToken]', this.llToken)
                .replace('[stream]', id)
                .replace('[platform]', this.platform)
                .replace('[timestamp', Date.now())
            jsonp(url, null, (err, data) => {
                if (err) {
                    console.error('auth token request not successful')
                } else {
                    this.authToken = data.token
                    PlayerEvents.$emit('play', data.url + '&dw=20')
                }
            })
        }
    }
})

export default UtopiaNLPlugin
