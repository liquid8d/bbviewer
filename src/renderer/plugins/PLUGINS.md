A *VideoPlugin* is a class containing an array of media objects and/or methods for playing media content. Media objects don't have to be included and can be retrieved from elsewhere, as long as the media object specifies a 'handler' property with the plugin id.

Example VideoPlugin

```javascript
import VideoPlugin from '../mixins/Plugins'
import axios from 'axios'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

const SamplePlugin = new VideoPlugin({
    id: 'sample',
    label: 'Sample Plugin',
    desc: '',
    poster: '',
    media: [
        { id: 'sample_url', label: 'Sample Media', poster: '', url: 'https://www.youtube.com/watch?v=8ndhidEmUbI' }
    ],
    config: {
        api: 'http://api.example.com/media'
    },
    play (src) {
        // src will be the media object you provided
        axios.get(this.config.api)
            .then(response => {
                // play src url after retrieving api data
                PlayerEvents.$emit('play', src.url)
            })
    }
    // You can override methods from VideoPlugin here
})

export default SamplePlugin
```