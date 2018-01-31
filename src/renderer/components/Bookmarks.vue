<template>
    <div class="page">
        <div class="container">
            <bar>
                <template slot="left">
                    <h1>{{ $t('title') }}</h1>
                </template>
                <template slot="center">
                </template>
                <template slot="right">
                    <router-link to="/" tag="button" class="icon" :title="$t('close')"><img src="~@/assets/controls/ic_cancel_white_48px.svg" /></router-link>
                </template>
            </bar>
            <!-- Bookmarks List -->
            <div v-if="bookmarks.length > 0" class="container list">
                <div v-for="b in bookmarks" :key="b.id">
                    <div class="ui bookmark">
                        <div v-if="b.icon" class="icon" :style="'background-image: url(\'' + b.icon + '\')'"></div>
                        <header>{{b.title}}</header>
                        <p>{{b.desc}}</p>
                    </div>
                </div>
            </div>
            <!-- No Bookmarks -->
            <div v-else class="container">
                <p>{{$t('desc')}}</p>
            </div>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "title": "Bookmarks",
        "close": "Close",
        "desc": "Some video streams support bookmarked events. Come back here when you start a stream to see if there are any!"
    }
}
</i18n>

<script>
    import axios from 'axios'
    import Bar from './Bar.vue'
    const { PlayerEvents } = require('./Player/PlayerEvents')
    export default {
        data () {
            return {
                bookmarks: []
            }
        },
        components: { Bar, PlayerEvents },
        mounted () {
            PlayerEvents.$on('loadstart', this.load)
            PlayerEvents.$on('stop', this.clear)
        },
        beforeDestroy () {
            PlayerEvents.$off('loadstart', this.load)
            PlayerEvents.$off('stop', this.clear)
        },
        methods: {
            load (url) {
                axios.get(url)
                    .then(response => console.dir(response.data))
            },
            clear () {
                this.bookmarks = []
            }
        }
    }
</script>

<style scoped>
    .reverse { flex-direction: column; }

    .bookmarks {
        height: 100%;
        background: rgb( 10, 10, 10 );
        color: rgb( 240, 240, 240 );
    }
    
    .bookmark {
        background-color: #222;
        color:#efefef;
        border-radius: 0.5em;
        padding: 0.25em;
        cursor: pointer;
    }
    
    .bookmark:focus {
        background-color: chartreuse;
    }

    .bookmark > header {
        font-weight: bold;
        pointer-events: none;
    }
    .bookmark > p {
        pointer-events: none;
    }
    
    .list {
        background-color: #333;
        border-radius: 0.5em;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        margin: 0.5em;
        overflow: auto;
    }
</style>
