<template>
    <div class="controls">
        <div class="bar alt-bar">
            <div ref="videoText" class="video-text"></div>
            <div class="section">
                <button class="icon" @mousedown.stop @click="screenshot()" v-bind:title="$t('screenshot')"><img src="static/controls/ic_camera_alt_white_48px.svg" /></button>
                <button class="icon" @click="$router.replace('bookmarks')" v-bind:title="$t('bookmarks')"><img src="static/controls/ic_bookmark_white_48px.svg" /></button>
                <button class="icon" @click="$router.replace('flashbacks')" v-bind:title="$t('flashbacks')"><img src="static/controls/ic_history_white_48px.svg" /></button>
            </div>
            <div class="section">
                <button class="icon" @click.capture="playerRedirect('toggleAngle')" v-bind:title="$t('angle')"><img src="static/controls/ic_videocam_white_48px.svg" /><span>{{angle}}</span></button>
                <button class="icon" @click="playerRedirect('toggleAudioPan')" v-bind:title="$t('pan')"><img src="static/controls/ic_speaker_white_48px.svg" /><span>{{audioPan}}</span></button>
                <button class="icon" @click="playerRedirect('toggleSpeed')" v-bind:title="$t('playbackRate')"><img src="static/controls/ic_timelapse_white_48px.svg" /><span>{{playbackRate}}</span></button>
                <button class="icon" @click="playerRedirect('toggleQuality')" v-bind:title="$t('quality')"><img src="static/controls/ic_equalizer_white_48px.svg" /><span>{{quality}}</span></button>
                <button class="icon" @click="$router.replace('cast')" v-bind:title="$t('cast')"><img src="static/controls/ic_cast_white_48px.svg" /></button>
            </div>
        </div>
        <vue-slider ref="seekbar" class="seekbar" immediate="false"></vue-slider>
        <component v-bind:is="view"></component>
    </div>
</template>

<i18n>
{
    "en": {
        "angle": "Angle",
        "back": "Back",
        "bookmarks": "Bookmarks",
        "cast": "Cast",
        "flashbacks": "Flashbacks",
        "pan": "Audio Pan",
        "playbackRate": "Playback Speed",
        "screenshot": "Screenshot",
        "quality": "Quality"
    }
}
</i18n>

<script>
    import Primary from './Primary'
    import Slider from './Slider'
    import router from '../../router'
    import Utils from '@/mixins/Utils'

    const { PlayerEvents } = require('../Player/PlayerEvents')
    export default {
        name: 'controlBar',
        router,
        components: { 'vue-slider': Slider },
        mixins: [ Utils ],
        data () {
            return {
                angle: '',
                audioPan: 'C',
                playbackRate: '1.0',
                quality: 'Auto',
                view: Primary
            }
        },
        mounted () {
            PlayerEvents.$on('anglechange', this.anglechange)
            PlayerEvents.$on('audiopanchange', this.audiopanchange)
            PlayerEvents.$on('playbackratechange', this.playbackratechange)
            PlayerEvents.$on('stop', this.stop)
            PlayerEvents.$on('update', this.onUpdate)
            PlayerEvents.$on('videotext', this.onVideoText)
            this.$refs.seekbar.$on('endslide', this.onSeekValue)
        },
        beforeDestroy () {
            PlayerEvents.$off('anglechange', this.anglechange)
            PlayerEvents.$off('audiopanchange', this.audiopanchange)
            PlayerEvents.$off('playbackratechange', this.playbackratechange)
            PlayerEvents.$off('update', this.onUpdate)
            PlayerEvents.$off('videotext', this.onVideoText)
            PlayerEvents.$off('stop', this.stop)
            this.$refs.seekbar.$off('endslide', this.onSeekValue)
        },
        methods: {
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            },
            anglechange (which) {
                this.angle = which
            },
            audiopanchange (which) {
                this.audioPan = (which === 'left') ? 'L' : (which === 'right') ? 'R' : 'C'
            },
            playbackratechange (rate) {
                this.playbackRate = rate
            },
            onUpdate (data) {
                if (!this.$refs.seekbar.isSliding) this.$refs.seekbar.setValue(data.position)
            },
            onVideoText (text) {
                if (this.$refs.videoText) this.$refs.videoText.innerHTML = text
            },
            onSeekValue (e) {
                var val = e.offsetX
                var max = parseInt(window.getComputedStyle(e.currentTarget).width)
                var requested = val / max
                PlayerEvents.$emit('seekNormalize', requested)
            },
            stop () {
                if (this.$refs.videoText) this.$refs.videoText.innerHTML = ''
            }
        }
    }
</script>

<style scoped>
.hidden {
    visibility:hidden;
}

.bar {
    display: flex;
    flex-direction: row;
    padding: 0;
}

.section {
    border-left: 0.05em solid #2a2a2a;
}
.controls {
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    background: #1b1f22;
}

.controls >>> button.icon {
    background: none;
}

.controls >>> button:hover {
    background-color:#666;
}

.controls >>> button:focus {
    background-color:#18b353;
}

.video-text {
    color:#18b353;
    font-size: 0.75em;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    margin: 0.25em;
}
</style>