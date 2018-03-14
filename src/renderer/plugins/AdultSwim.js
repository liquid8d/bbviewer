import VideoPlugin from '../mixins/Plugins'
import axios from 'axios'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const AdultSwimPlugin = new VideoPlugin({
    id: 'adult-swim',
    label: 'Adult Swim',
    desc: 'Watch free Adult Swim streams',
    poster: 'static/media/adult-swim.jpg',
    config: {
        apiBase: 'http://www.adultswim.com/videos/api/v3/',
        apiVideos: 'http://www.adultswim.com/videos/api/v3/videos/',
        params: 'fields=stream'
    },
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
    play (src) {
        this.fetchVideo(src.id)
    },
    fetchVideo (id) {
        // TODO jsonp request? (causes error right now)
        axios.get(this.config.apiVideos + id + '?' + this.config.params)
            .then(response => {
                PlayerEvents.$emit('play', response.data.data.stream.assets[0].url)
            })
    }
})

export default AdultSwimPlugin
