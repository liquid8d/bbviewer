<template>
    <div class="page overlay">
        <div class="container">
            <h1>Browse: {{path}}</h1>
        </div>
        <div class="container stretch">
            <!-- Back poster -->
            <div class="card ui" tabindex="-1" @click="routePrevious">
                <h1 style="position: absolute; bottom: 0.2em;">Back</h1>
            </div>
            <template v-if="items">
                <!-- Item Folders -->
                <div v-if="item.folder" class="card folder ui" tabIndex="-1" @click.stop="routeTo(item.path + '/' + item.id)" :key="index" v-for="(item, index) in filter">
                    <img v-if="item.poster" v-bind:src="item.poster" />
                    <div v-if="item.title || item.desc" class="content">
                        <h1>{{item.title}}</h1>
                        <p>{{item.desc}}</p>
                    </div>
                </div>
                <!-- Single Items -->
                <div v-if="!item.folder" class="card ui" tabIndex="-1" @click.stop="play(item)" :key="item.id" v-for="item in filter" >
                    <img v-bind:src="item.poster" />
                    <div v-if="item.title || item.desc" class="content">
                        <h1>{{item.title}}</h1>
                        <p>{{item.desc}}</p>
                    </div>
                </div>
            </template>
        </div>
        <div class="container">
            <button class="icon" @mousedown.stop @click="$router.replace('/')" v-bind:title="$t('back')"><img src="/static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('back')}}</span></button>
            <button class="icon" @mousedown.stop @click="fetch()" v-bind:title="$t('refresh')"><img src="/static/controls/ic_refresh_white_48px.svg" /><span>{{$t('refresh')}}</span></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "back": "Back",
        "refresh": "Force Refresh"
    }
}
</i18n>

<script>
    import axios from 'axios'
    import Plugins from '../mixins/Plugins'

    // content Plugins
    require('@/plugins/AllAccess')
    require('@/plugins/AdultSwim')
    require('@/plugins/BBUS')
    require('@/plugins/Livestream')
    require('@/plugins/UtopiaNL')

    const { PlayerEvents } = require('./Player/PlayerEvents')
    
    export default {
        name: 'browse',
        components: { PlayerEvents },
        mixins: [ Plugins ],
        data () {
            return {
                fetchRemote: true,
                lastFetch: 0,
                updateFreq: 300,
                all: [],
                items: [],
                filter: [],
                path: ''
            }
        },
        mounted () {
            this.path = this.$route.query.path
            // do fetch
            if (this.items.length === 0 || Date.now() > this.lastFetch + this.updateFreq) {
                this.updateFreq = Date.now()
                this.fetch()
                this.filterItems(this.$route.query)
            }
            this.$extendedInput.selectEl()
        },
        methods: {
            fetch () {
                this.items = []
                let plugins = this.getPlugins()
                // add all plugin media to this.items
                Object.keys(plugins).forEach(id => {
                    if (plugins[id].media || plugins[id].src) this.addItem(plugins[id])
                })

                // fetch remote items
                if (this.fetchRemote) {
                    axios.get('http://goodiesfor.me/bbviewer/content')
                        .then(response => {
                            Object.keys(response.data.media).forEach(m => {
                                this.addItem(response.data.media[m], '')
                            })
                            this.filterItems({ path: this.path })
                        })
                        .catch((err) => {
                            console.log('error getting content: ' + err)
                        })
                }
            },
            addItem (media, path) {
                media = {
                    id: media.id,
                    title: media.title,
                    desc: media.desc,
                    poster: media.poster,
                    media: media.media,
                    path: path || '',
                    handler: media.handler,
                    src: media.src
                }
                if (!media.media) delete media.media
                if (!media.src) delete media.src
                if (!media.handler) delete media.handler
                if (media.media) {
                    media.folder = true
                    Object.keys(media.media).forEach(m => this.addItem(media.media[m], media.path + '/' + media.id))
                    delete media.media
                } else {
                    media.folder = false
                    // media.path = media.path.substr(0, media.path.length - media.id.length - 1)
                }
                this.items.push(media)
            },
            filterItems (query) {
                if (query && query.path) {
                    this.filter = this.items.filter(val => val.path === query.path)
                } else {
                    this.filter = this.items.filter(val => val.path === '')
                    // this.filter = this.items.filter(val => (val.folder && val.path === '') || (!val.folder && val.src && val.path === ''))
                }
            },
            play (item) {
                if (item.handler) {
                    console.log('playing with handler: ' + item.handler)
                    this.getPlugin(item.handler).play(item)
                    this.$router.push('/')
                } else if (item.src) {
                    this.playerRedirect('play', item.src)
                    this.$router.push('/')
                } else {
                    console.warn('couldn\'t play unrecognized item')
                }
            },
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            },
            routePrevious () {
                if (this.path) {
                    this.path = (this.path.split('/').length > 0) ? this.path.substr(0, this.path.lastIndexOf('/')) : null
                    this.filterItems({ path: this.path })
                } else {
                    this.$router.push('/')
                }
            },
            routeTo (path) {
                this.path = path
                this.filterItems({ path: this.path })
                this.$router.push('/browse?path=' + path)
            }
        }
    }
</script>

<style>
    .card {
        position: relative;
        display: inline-flex;
        background-color: #111;
        border: 2px solid #222;
        box-sizing: border-box;
        margin: 0.5em;
        padding: 0.5em;
        width: 8em;
        height: 10em;
        cursor:pointer;
    }

    .card.folder {
        background-color:rgb(55, 11, 80);
    }
    
    .card:focus {
        border: 1px solid chartreuse;
    }

    .card > img {
        position: relative;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .card > .content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4em;
        padding: 0.5em;
        background-color: rgba(10, 10, 10, 0.9);
    }

    .card > .content > h1 {
        color: #efefef;
        font-size: 0.75em;
    }

    .card > .content > p {
        color: #888;
        font-size: 0.6em;
    }

    .spinner {
        margin: 100px auto 0;
        width: 70px;
        text-align: center;
    }

    .spinner > div {
        width: 18px;
        height: 18px;
        background-color: #333;

        border-radius: 100%;
        display: inline-block;
        -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
        animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    }

    .spinner .bounce1 {
        -webkit-animation-delay: -0.32s;
        animation-delay: -0.32s;
    }

    .spinner .bounce2 {
        -webkit-animation-delay: -0.16s;
        animation-delay: -0.16s;
    }

    @-webkit-keyframes sk-bouncedelay {
        0%, 80%, 100% { -webkit-transform: scale(0) }
        40% { -webkit-transform: scale(1.0) }
    }

    @keyframes sk-bouncedelay {
        0%, 80%, 100% { 
            -webkit-transform: scale(0);
            transform: scale(0);
        } 40% { 
            -webkit-transform: scale(1.0);
            transform: scale(1.0);
        }
    }
</style>