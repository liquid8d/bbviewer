<template>
    <div class="menu">
        <div class="item">
            <span>{{$t('volume')}}</span>
            <volume></volume>
        </div>
        <div class="item">
            <span>{{$t('audio-pan')}}</span>
            <audio-pan></audio-pan>
        </div>
        <div class="item">
            <span>{{$t('speed')}}</span>
            <speed></speed>
        </div>
        <div class="item">
            <span>{{$t('angles')}}</span>
            <angles></angles>
        </div>
        <div class="item">
            <span>{{$t('more')}}</span>
            <button class="icon" @mousedown.stop @click="$router.push('/bookmarks')" v-bind:title="$t('bookmarks')"><img src="~@/assets/controls/ic_bookmark_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="$router.push('notifications')" v-bind:title="$t('notifications')"><img src="~@/assets/controls/ic_new_releases_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="playerRedirect('pip')" v-bind:title="$t('pip')"><img src="~@/assets/controls/ic_picture_in_picture_alt_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="setWindowOnTop()" v-bind:title="$t('ontop')"><img src="~@/assets/controls/ic_flip_to_front_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="createNewWindow()" v-bind:title="$t('window')"><img src="~@/assets/controls/ic_open_in_new_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="$router.push('/donate')" v-bind:title="$t('donate')"><img src="~@/assets/controls/ic_monetization_on_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="$router.push('/about')" v-bind:title="$t('about')"><img src="~@/assets/controls/ic_info_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="$router.push('/settings')" v-bind:title="$t('settings')"><img src="~@/assets/controls/ic_settings_white_48px.svg" /></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "about": "About",
        "angles": "Angles",
        "audio-pan": "Audio Pan",
        "bookmarks": "Bookmarks",
        "donate": "Donate",
        "more": "More",
        "ontop": "Toggle Window Pin",
        "notifications": "Notifications",
        "pip": "Picture in Picture",
        "settings": "Settings",
        "speed": "Speed",
        "volume": "Volume",
        "window": "New Window"
    }
}
</i18n>

<script>
    import Volume from './Volume'
    import AudioPan from './AudioPan'
    import Speed from './Speed'
    import Angles from './Angles'
    import Utils from '@/mixins/Utils'

    const { PlayerEvents } = require('../Player/PlayerEvents')

    export default {
        name: 'control-menu',
        components: { Volume, AudioPan, Speed, Angles },
        mixins: [ Utils ],
        mounted () {
            this.preventDraggables()
            PlayerEvents.$on('toggleMenu', this.toggleMenu)
        },
        methods: {
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            },
            toggleMenu () {
                this.$el.style.display = (this.$el.style.display === 'none' || this.$el.style.display === '') ? 'flex' : 'none'
            }
        }
    }
</script>

<style scoped>
    .menu {
        background: #1b1f22;
        display: none;
        flex-direction: column;
        position: absolute;
        right: 0.5em;
        bottom: 4.75em;
        top: 0.5em;
        justify-content: center;
        border: 0.05em solid #444;
        padding: 0.25em;
        overflow-y: auto;
        width: 33%;
        min-width: 12em;
        max-width: 16em;
    }
    .menu > .item {
        margin: 0.05em;
        padding: 0.5em;
    }
</style>