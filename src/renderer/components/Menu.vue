<template>
    <div class="page overlay">
        <div class="menu">
            <div class="ui item" tabindex="-1" @mousedown.stop @click="$router.replace('/')" v-bind:title="$t('back')">
                <img src="static/controls/ic_chevron_left_white_48px.svg" />
                <span>{{$t('back')}}</span>
            </div>
            <div class="item" tabindex="-1">
                <img src="static/controls/ic_volume_up_white_48px.svg" />
                <audio-pan></audio-pan>
            </div>
            <div class="item" tabindex="-1">
                <img src="static/controls/ic_volume_up_white_48px.svg" />
                <volume></volume>
            </div>
            <div class="item" tabindex="-1">
                <img src="static/controls/ic_timelapse_white_48px.svg" />
                <speed></speed>
            </div>
            <div class="item" tabindex="-1">
                <img src="static/controls/ic_settings_overscan_white_48px.svg" />
                <div class="pills">
                    <button @click="resizeWindow(640, 360)">{{$t('winSmall')}}</button>
                    <button @click="resizeWindow(800, 450)">{{$t('winMed')}}</button>
                    <button @click="resizeWindow(1280, 720)">{{$t('winLarge')}}</button>
                </div>
            </div>
            <div class="ui item" tabindex="-1" @mousedown.stop @click="setWindowOnTop()" v-bind:title="$t('back')">
                <img src="static/controls/ic_flip_to_front_white_48px.svg" />
                <span>{{$t('ontop')}}</span>
            </div>
            <div class="ui item" tabindex="-1" @mousedown.stop @click="playerRedirect('pip')" v-bind:title="$t('pip')">
                <img src="static/controls/ic_picture_in_picture_alt_white_48px.svg" />
                <span>{{$t('pip')}}</span>
            </div>
            <div class="ui item" tabindex="-1" @mousedown.stop @click="createNewWindow()" v-bind:title="$t('window')">
                <img src="static/controls/ic_open_in_new_white_48px.svg" />
                <span>{{$t('window')}}</span>
            </div>
            <div class="ui item" tabindex="-1" @mousedown.stop @click="$router.replace('bookmarks')" v-bind:title="$t('bookmarks')">
                <img src="static/controls/ic_bookmark_white_48px.svg" />
                <span>{{$t('bookmarks')}}</span>
            </div>
            <div class="ui item" tabindex="-1" @mousedown.stop @click="$router.replace('flashbacks')" v-bind:title="$t('flashbacks')">
                <img src="static/controls/ic_history_white_48px.svg" />
                <span>{{$t('flashbacks')}}</span>
            </div>
            <div class="ui item" tabindex="-1" @mousedown.stop @click="$router.replace('notifications')" v-bind:title="$t('notifications')">
                <img src="static/controls/ic_new_releases_white_48px.svg" />
                <span>{{$t('notifications')}}</span>
            </div>
            <div class="ui item" tabindex="-1" @mousedown.stop @click="$router.replace('cast')" v-bind:title="$t('cast')">
                <img src="static/controls/ic_cast_white_48px.svg" />
                <span>{{$t('cast')}}</span>
            </div>
            <div class="ui item" tabindex="-1" @mousedown.stop @click="$router.replace('donate')" v-bind:title="$t('donate')">
                <img src="static/controls/ic_monetization_on_white_48px.svg" />
                <span>{{$t('donate')}}</span>
            </div>
            <div class="ui item" tabindex="-1" @mousedown.stop @click="$router.replace('settings')" v-bind:title="$t('settings')">
                <img src="static/controls/ic_settings_white_48px.svg" />
                <span>{{$t('settings')}}</span>
            </div>
            <div class="ui item" tabindex="-1" @mousedown.stop @click="$router.replace('about')" v-bind:title="$t('about')">
                <img src="static/controls/ic_info_white_48px.svg" />
                <span>{{$t('about')}}</span>
            </div>
        </div>
    </div>
</template>
<i18n>
{
    "en": {
        "about": "About",
        "back": "Back",
        "bookmarks": "Bookmarks",
        "cast": "Cast",
        "donate": "Donate",
        "flashbacks": "Flashbacks",
        "notifications": "Notifications",
        "ontop": "Toggle On Top",
        "pip": "Picture in Picture",
        "settings": "Settings",
        "window": "New Window",
        "winSmall": "S",
        "winMed": "M",
        "winLarge": "L"
    }
}
</i18n>
<script>
    import Volume from './Controls/Volume'
    import AudioPan from './Controls/AudioPan'
    import Speed from './Controls/Speed'
    import Utils from '@/mixins/Utils'

    const { PlayerEvents } = require('./Player/PlayerEvents')

    export default {
        name: 'app-menu',
        mixins: [ Utils ],
        components: { Volume, AudioPan, Speed },
        mounted () {
            this.preventDraggables()
            this.$extendedInput.selectEl()
        },
        methods: {
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            }
        }
    }
</script>

<style scoped>
    .menu {
        background: #1b1f22;
        flex-direction: column;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 15em;
        border-left: 0.05em solid #1d1d1d;
        padding: 0.5em 0 0.5em 0;
        overflow: auto;
    }

    .menu > .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0.05em;
        padding: 0.75em;
        cursor: pointer;
        border-bottom:  0.05em solid #24292e;
    }

    .menu > .item > :first-child {
        display: flex;
        flex-grow: 0;
        width: 1.75em;
        height: 1.25em;
        align-items: center;
    }

    .menu > .item > :nth-child(2) {
        flex-grow: 1;
        line-height: 1.25em;
        font-size: 0.9em;
        text-align: center;
        color: #eee;
    }

    .menu > .item > .pills {
        display: inline-flex;
        justify-content: center;
    }    
</style>