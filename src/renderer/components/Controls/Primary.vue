<template>
    <bar>
        <template slot="left">
            <button class="icon" ref="browse" @mousedown.stop @click="$router.replace('browse')" v-bind:title="$t('browse')"><img src="static/controls/ic_video_library_white_48px.svg" /></button>
            <button class="icon" @click.stop.prevent="playerRedirect('toggleMute')" v-bind:title="$t('mute')"><img ref="volumeImage" src="static/controls/ic_volume_up_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="playerRedirect('stop')" v-bind:title="$t('stop')"><img src="static/controls/ic_stop_white_48px.svg" /></button>
        </template>
        <template slot="center">
            <button class="icon" @mousedown.stop @click="playerRedirect('seek', -300)" v-bind:title="$t('seek')"><img src="static/controls/ic_skip_previous_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="playerRedirect('seek', -30)" v-bind:title="$t('seek')"><img src="static/controls/ic_chevron_left_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="playerRedirect('pause')" v-bind:title="$t('pause')"><img ref="playImage" src="static/controls/ic_play_arrow_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="playerRedirect('seek', 30)" v-bind:title="$t('seek')"><img src="static/controls/ic_chevron_right_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="playerRedirect('seek', 300)" v-bind:title="$t('seek')"><img src="static/controls/ic_skip_next_white_48px.svg" /></button>
            <button ref="liveButton" class="disabled" @mousedown.stop @click="playerRedirect('goLive')" v-bind:title="$t('live')">{{$t('live')}}</button>
        </template>
        <template slot="right">
            <button class="icon" @mousedown.stop @click="toggleAlt" v-bind:title="$t('alt-bar')"><img src="static/controls/ic_more_horiz_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="showMenu" v-bind:title="$t('settings')"><img src="static/controls/ic_settings_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="fullscreen()" v-bind:title="$t('fullscreen')"><img src="static/controls/ic_fullscreen_white_48px.svg" /></button>
        </template>
    </bar>
</template>

<i18n>
{
    "en": {
        "alt-bar": "Toggle Other Controls",
        "browse": "Browse",
        "fullscreen": "Fullscreen",
        "live": "LIVE",
        "mute": "Mute",
        "pause": "Play/Pause",
        "seek": "Seek",
        "settings": "Settings",
        "stop": "Stop"
    }
}
</i18n>

<script>
    import Utils from '@/mixins/Utils'
    import Bar from '../Bar'
    const { PlayerEvents } = require('../Player/PlayerEvents')
    export default {
        name: 'primary',
        components: { Bar, PlayerEvents },
        mixins: [ Utils ],
        mounted () {
            this.preventDraggables()
            this.$extendedInput.selectEl(this.$refs.browse)
            PlayerEvents.$on('muted', this.muted)
            PlayerEvents.$on('onPlay', this.onPlay)
            PlayerEvents.$on('onPause', this.onPause)
            PlayerEvents.$on('live', this.live)
            PlayerEvents.$on('notLive', this.notLive)
        },
        beforeDestroy () {
            PlayerEvents.$off('muted', this.muted)
            PlayerEvents.$off('onPlay', this.onPlay)
            PlayerEvents.$off('onPause', this.onPause)
            PlayerEvents.$off('live', this.live)
            PlayerEvents.$off('notLive', this.notLive)
        },
        methods: {
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            },
            live () {
                if (this.$refs.liveButton) this.$refs.liveButton.style.className = 'live'
            },
            muted (muted) {
                if (this.$refs.volumeImage) this.$refs.volumeImage.src = (muted) ? 'static/controls/ic_volume_off_white_48px.svg' : 'static/controls/ic_volume_up_white_48px.svg'
            },
            notLive () {
                if (this.$refs.liveButton) this.$refs.liveButton.style.className = 'notlive'
            },
            onPlay () {
                if (this.$refs.liveButton) this.$refs.liveButton.style.className = 'notlive'
                if (this.$refs.playImage) this.$refs.playImage.src = 'static/controls/ic_pause_white_48px.svg'
            },
            onPause () {
                if (this.$refs.playImage) this.$refs.playImage.src = 'static/controls/ic_play_arrow_white_48px.svg'
            },
            showMenu () {
                PlayerEvents.$emit('toggleMenu')
            },
            toggleAlt () {
                let alt = document.querySelector('.alt-bar')
                if (alt && alt.style.display === 'none') {
                    alt.style.display = ''
                } else {
                    alt.style.display = 'none'
                }
            }
        }
    }
</script>

<style>
    .disabled {
        display: none;
    }
    .live {
        display: block;
        color: red;
    }
    .notlive {
        display: block;
        color:slategray;
    }
</style>