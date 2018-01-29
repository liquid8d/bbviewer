import Vue from 'vue'
import axios from 'axios'
import Plugins from '../mixins/Plugins'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const UtopiaNLPlugin = new Vue({
    data () {
        return {
            id: 'utopia-nl',
            title: 'Utopia NL',
            desc: '',
            poster: 'http://www.utopiatv.nl/version/1513595886/data/locale/nl_NL/image/logo-utopia.png',
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
        play (src) {
            // play path
            if (!this.llToken || this.llExpires < Date.now()) {
                // fetch a new long lived token
                this.fetchLLToken(this.urlLongLived.replace('[timestamp]', Date.now()), src)
            } else {
                // have long lived token, just need auth token for this stream
                this.fetchAuthToken(src)
            }
        },
        fetchLLToken (url, id) {
            axios.get(url)
                .then(response => {
                    if (response.data.success) {
                        this.llToken = response.data.authToken
                        this.llExpire = response.data.time
                        this.fetchAuthToken(id)
                    } else {
                        console.error('long lived token request not successful')
                    }
                })
                .catch(err => {
                    console.error('error retrieving long lived token: ' + err)
                })
        },
        fetchAuthToken (id) {
            var url = this.urlAuthToken.replace('[authToken]', this.llToken)
                .replace('[stream]', id)
                .replace('[platform]', this.platform)
                .replace('[timestamp', Date.now())
            axios.get(url)
                .then(response => {
                    if (response.data.success) {
                        this.authToken = response.data.token
                        PlayerEvents.$emit('play', response.data.url + '&dw=20')
                    } else {
                        console.error('auth token request not successful')
                    }
                })
                .catch(err => console.error('error retrieving auth token: ' + err))
        }
    }
})

export default UtopiaNLPlugin
