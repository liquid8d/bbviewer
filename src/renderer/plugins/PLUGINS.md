A plugin is a Vue component that is extended with the Plugins mixin, and contains specific methods to handle playing media content:

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