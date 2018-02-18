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
            <span></span>
            <div>
                <button class="icon" @mousedown.stop @click="setWindowOnTop()" v-bind:title="$t('ontop')"><img src="static/controls/ic_picture_in_picture_alt_white_48px.svg" /></button>
                <button class="icon" @mousedown.stop @click="$router.push('/bookmarks')" v-bind:title="$t('bookmarks')"><img src="static/controls/ic_bookmark_white_48px.svg" /></button>
                <button class="icon" @mousedown.stop @click="$router.push('notifications')" v-bind:title="$t('notifications')"><img src="static/controls/ic_new_releases_white_48px.svg" /></button>
                <button class="icon" @mousedown.stop @click="playerRedirect('pip')" v-bind:title="$t('pip')"><img src="static/controls/ic_picture_in_picture_alt_white_48px.svg" /></button>
            </div>
        </div>
        <div class="item">
            <span></span>
            <div>
                <button class="icon" @mousedown.stop @click="createNewWindow()" v-bind:title="$t('window')"><img src="static/controls/ic_open_in_new_white_48px.svg" /></button>
                <button class="icon" @mousedown.stop @click="$router.push('/donate')" v-bind:title="$t('donate')"><img src="static/controls/ic_monetization_on_white_48px.svg" /></button>
                <button class="icon" @mousedown.stop @click="$router.push('/about')" v-bind:title="$t('about')"><img src="static/controls/ic_info_white_48px.svg" /></button>
            </div>
        </div>
        <div class="item">
            <span></span>
            <div>
                <button class="icon" @mousedown.stop @click="$router.push('/settings')" v-bind:title="$t('settings')"><img src="static/controls/ic_settings_white_48px.svg" /></button>
            </div>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "about": "About",
        "angles": "Multi-Angle",
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
            PlayerEvents.$on('showMenu', this.showMenu)
        },
        methods: {
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            },
            showMenu (visible) {
                if (visible === undefined) visible = this.$el.style.display === 'none' || this.$el.style.display === ''
                this.$el.style.display = (visible) ? 'flex' : 'none'
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
        bottom: 5em;
        right: 0.5em;
        border: 0.05em solid #444;
        padding: 0.25em;
        width: 33%;
        min-width: 12em;
        max-width: 16em;
        min-height: 3em;
        overflow: auto;
    }
    .menu > .item {
        display: flex;
        flex-direction: row;
        margin: 0.05em;
        padding: 0 0.5em 0 0.5em;
    }

    .menu > .item > :first-child {
        display: flex;
        flex-grow: 1;
        align-items: center;
    }

    .menu > .item > :nth-child(2) {
        flex-grow: 0;
    }
</style>