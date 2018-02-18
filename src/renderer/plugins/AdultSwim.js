import Vue from 'vue'
import axios from 'axios'
import Plugins from '../mixins/Plugins'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const AdultSwimPlugin = new Vue({
    data () {
        return {
            id: 'adult-swim',
            title: 'Adult Swim',
            desc: 'Watch free Adult Swim streams',
            poster: 'static/media/adult-swim.jpg',
            apiBase: 'http://www.adultswim.com/videos/api/v3/',
            apiVideos: 'http://www.adultswim.com/videos/api/v3/videos/',
            params: 'fields=stream'
        }
    },
    components: { PlayerEvents },
    mixins: [ Plugins ],
    created () {
        this.registerPlugin(this)
        console.log('Adult Swim plugin initialized')
    },
    methods: {
        browse (path) {
            // return results for path
            // axios.get(this.apiBase + 'streams')
            //     .then(response => {
            //         let streams = JSON.parse(response)
            //         var content = []
            //         for (var stream in streams.data.streams) {
            //             content.push({
            //                 label: streams.data.streams[stream].title,
            //                 poster: streams.data.streams[stream].images.video,
            //                 src: streams.data.streams[stream].stream
            //             })
            //         }
            //         return content
            //     })
        },
        play (item) {
            this.fetchVideo(item.src.id)
        },
        fetchVideo (id) {
            // TODO jsonp request? (causes error right now)
            axios.get(this.apiVideos + id + '?' + this.params)
                .then(response => {
                    PlayerEvents.$emit('play', response.data.data.stream.assets[0].url)
                })
        }
    }
})

export default AdultSwimPlugin
