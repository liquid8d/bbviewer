import Vue from 'vue'
import axios from 'axios'
import Plugins from '../mixins/Plugins'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const AdultSwimPlugin = new Vue({
    data () {
        return {
            id: 'adult-swim',
            title: 'Adult Swim',
            desc: '',
            poster: 'https://pbs.twimg.com/profile_images/1634362280/AS-icon-300x300_400x400.jpg',
            handler: 'adult-swim',
            src: 'r0xw2u30R3GchW27yVqlug',
            apiBase: 'http://www.adultswim.com/videos/api/v3/',
            params: '?fields=title%2Ctype%2Cduration%2Ccollection_title%2Cimages%2Cstream%2Csegments%2Ctitle_id&iframe=false'
        }
    },
    components: { PlayerEvents },
    mixins: [ Plugins ],
    created () {
        this.registerPlugin(this)
    },
    methods: {
        browse (path) {
            // return results for path
            axios.get(this.apiBase + 'streams')
                .then(response => {
                    let streams = JSON.parse(response)
                    var content = []
                    for (var stream in streams.data.streams) {
                        content.push({
                            label: streams.data.streams[stream].title,
                            poster: streams.data.streams[stream].images.video,
                            src: streams.data.streams[stream].stream
                        })
                    }
                    return content
                })
        },
        play (id) {
            axios.get(this.apiBase + 'videos/' + id + this.params)
                .then(response => {
                    PlayerEvents.$emit('play', response.data.data.stream.assets[0].url)
                })
        }
    }
})

export default AdultSwimPlugin
