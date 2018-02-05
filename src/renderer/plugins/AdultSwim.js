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
            media: [
                { id: 'animation-marathon', title: 'Animation Marathon', desc: '', poster: 'https://i.cdn.turner.com/adultswim/big/img/2018/01/09/Animation2_Marathon.jpg', handler: 'adult-swim', src: { id: 'Xv-Zn5pcTZO0bmiWd8ZgNw' } },
                { id: 'toonami', title: 'Toonami', desc: '', poster: 'https://i.cdn.turner.com/adultswim/big/video/toonami/Toonami_Stream_Share_Image_16x9.jpg', handler: 'adult-swim', src: { id: 'fimTbVMdSK-ZRye6iQF4uA' } },
                { id: 'williams', title: 'Williams Stream', desc: '', poster: 'https://i.cdn.turner.com/adultswim/big/img/2017/08/29/WS_thumbs.jpg', handler: 'adult-swim', src: { id: 'd8DEBj7QRfetLsRgFnGEyg' } },
                { id: 'rick-and-morty-marathon', title: 'Rick and Morty Marathon', desc: '', poster: 'https://i.cdn.turner.com/adultswim/big/img/2018/01/09/RickMorty2_Marathon_2.jpg', handler: 'adult-swim', src: { id: 'jqX79_YeQkm3I9kHJYGAXA' } },
                { id: 'venture-bros', title: 'The Venture Bros.', desc: '', poster: 'https://i.cdn.turner.com/adultswim/big/video/the-venture-bros/venturebros_mt.jpg', handler: 'adult-swim', src: { id: '5g7-O12-SeWvBbfTKnI9CA' } }
            ],
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
