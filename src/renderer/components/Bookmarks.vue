<template>
    <div class="page overlay">
        <div class="container">
            <bar>
                <template slot="left">
                    <h1>{{ $t('title') }}</h1>
                </template>
                <template slot="center">
                </template>
                <template slot="right">
                    <router-link to="/" tag="button" class="icon" :title="$t('close')"><img src="static/controls/ic_cancel_white_48px.svg" /></router-link>
                </template>
            </bar>
        </div>
        <div class="container">
            <input ref="filterText" @keydown="allowUpDown" @keyup="filter" type="text" style="border:none;width: 100%;padding:0.5em;" />
        </div>
        <!-- Bookmarks List -->
        <div v-if="filtered.length > 0" class="container stretch">
            <div v-for="b in filtered" @keydown="allowLeftRight" :key="b.id">
                <div class="ui bookmark" tabindex="-1" @click="load(b)">
                    <div v-if="b.icon" class="icon" :style="'background-image: url(\'' + b.icon + '\')'"></div>
                    <header>{{b.event_title}}</header>
                    <p>{{b.event_day}} {{b.event_time}} - {{$t('cam')}} {{b.channel}}</p>
                </div>
            </div>
        </div>
        <!-- No Bookmarks -->
        <div v-else class="container list">
            <p>{{$t('desc')}}</p>
        </div>
        <div class="container">
            <button ref="backButton" class="icon" @mousedown.stop @click="$router.replace('/')" v-bind:title="$t('back')"><img src="static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('back')}}</span></button>
            <button class="icon" @mousedown.stop @click="requestBookmarks(true)" v-bind:title="$t('refresh')"><img src="static/controls/ic_refresh_white_48px.svg" /><span>{{$t('refresh')}}</span></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "back": "Back",
        "cam": "Cam ",
        "close": "Close",
        "desc": "Some video streams support bookmarked events. Come back here when you start a stream to see if there are any!",
        "refresh": "Force Refresh",
        "title": "Bookmarks",
        "watch": "Watch"
    }
}
</i18n>

<script>
    import Bar from './Bar.vue'
    import { clearInterval, setTimeout } from 'timers'
    const { PlayerEvents } = require('./Player/PlayerEvents')
    
    var updateTimer

    export default {
        data () {
            return {
                bookmarks: {
                    getter () {
                        return this.$store.state.bookmarks
                    },
                    setter (bookmarks) {
                        this.$store.state.bookmarks = bookmarks
                    }
                },
                filtered: [],
                enabled: true,
                lastUpdate: 0,
                updateFrequency: 10000
            }
        },
        components: { Bar, PlayerEvents },
        mounted () {
            if (this.enabled) {
                PlayerEvents.$on('stop', this.clear)
                PlayerEvents.$on('provideBookmarks', this.provideBookmarks)
                this.requestBookmarks(true)
            }
        },
        methods: {
            computed: {
                bookmarks () {
                    return this.$store.state.bookmarks
                }
            },
            allowUpDown (e) {
                if (this.$extendedInput.Keyboard.config.up.includes(e.which) ||
                this.$extendedInput.Keyboard.config.down.includes(e.which) ||
                this.$extendedInput.Keyboard.config.home.includes(e.which)) {
                    e.preventDefault()
                } else {
                    e.stopPropagation()
                }
            },
            allowLeftRight (e) {
                if (this.$extendedInput.Keyboard.config.left.includes(e.which)) {
                    this.$extendedInput.selectEl(this.$refs.filterText)
                } else if (this.$extendedInput.Keyboard.config.right.includes(e.which)) {
                    this.$extendedInput.selectEl(this.$refs.backButton.$el)
                }
            },
            filter (e) {
                if (this.bookmarks && this.bookmarks.length > 0) {
                    // TODO multi-word, and, or
                    this.filtered = this.bookmarks.filter(bookmark => this.$refs.filterText.value === '' || bookmark.event_title.toLowerCase().indexOf(this.$refs.filterText.value.toLowerCase()) > -1)
                    // this.filtered = this.bookmarks.filter(bookmark => bookmark.event_title.toLowerCase().split(' ').every(val => this.$refs.filterText.value.toLowerCase().split(' ').includes(val)))
                } else {
                    this.filtered = this.bookmarks
                }
            },
            load (bookmark) {
                PlayerEvents.$emit('loadBookmark', bookmark)
            },
            requestBookmarks (forced) {
                if (forced || this.lastUpdate - Date.now() <= this.frequency) {
                    this.lastUpdate = Date.now()
                    console.log('request bookmarks: ' + this.lastUpdate)
                    PlayerEvents.$emit('requestBookmarks')
                }
                clearInterval(updateTimer)
                updateTimer = setTimeout(e => this.requestBookmarks(true), this.updateFrequency)
            },
            provideBookmarks (bookmarks) {
                if (bookmarks) {
                    this.bookmarks = bookmarks
                    this.filtered = this.bookmarks
                }
            },
            clear () {
                console.log('cleared bookmarks')
                this.bookmarks = this.filtered = []
            }
        }
    }
</script>

<style scoped>
    .reverse { flex-direction: column; }

    .list {
        border-radius: 0.5em;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        margin: 0.5em;
        overflow: auto;
    }

    .bookmark {
        color:#efefef;
        border-radius: 0.2em;
        margin: 0.25em;
        padding: 0.25em 0.5em 0.25em 0.5em;
        cursor: pointer;
    }
    
    .bookmark:focus, .bookmark:hover {
        background-color: #18b353;
    }

    .bookmark > * {
        pointer-events: none;
    }

    .bookmark > p {
        font-size: 0.7em;
    }

    .options {
        padding: 0.2em;
        border-top: 1px solid rgb( 40, 40, 40 );
        max-height: 2.75em;
        text-align: right;
        width: 100%;
    }

</style>
