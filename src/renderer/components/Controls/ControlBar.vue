<template>
    <div class="controls">
        <div class="bar">
            <div ref="videoText" class="video-text"></div>
            <div class="section">
                <button class="icon" @click="$router.replace('bookmarks')" v-bind:title="$t('bookmarks')"><img src="static/controls/ic_bookmark_white_48px.svg" /></button>
                <button class="icon" @click="$router.replace('flashbacks')" v-bind:title="$t('flashbacks')"><img src="static/controls/ic_history_white_48px.svg" /></button>
            </div>
            <div class="section">
                <button class="icon" @click="playerRedirect('toggleAngle')" v-bind:title="$t('angle')"><img src="static/controls/ic_videocam_white_48px.svg" /><span>{{angle}}</span></button>
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
        "quality": "Quality"
    }
}
</i18n>

<script>
    import Primary from './Primary'
    import Slider from './Slider'
    import router from '../../router'
    import Angles from './Angles'
    import Utils from '@/mixins/Utils'

    const { PlayerEvents } = require('../Player/PlayerEvents')
    export default {
        name: 'controlBar',
        router,
        components: { Angles, 'vue-slider': Slider },
        mixins: [ Utils ],
        data () {
            return {
                angle: 1,
                audioPan: 'C',
                playbackRate: '1.0',
                quality: 'Auto',
                view: Primary
            }
        },
        mounted () {
            PlayerEvents.$on('streamInfo', this.updateInfo)
            PlayerEvents.$on('audiopanchange', this.audiopanchange)
            PlayerEvents.$on('playbackratechange', this.playbackratechange)
            this.$refs.seekbar.$on('endslide', this.onSeekValue)
        },
        beforeDestroy () {
            PlayerEvents.$off('streamInfo', this.updateInfo)
            PlayerEvents.$off('audiopanchange', this.audiopanchange)
            PlayerEvents.$off('playbackratechange', this.playbackratechange)
        },
        methods: {
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            },
            audiopanchange (which) {
                this.audioPan = (which === 'left') ? 'L' : (which === 'right') ? 'R' : 'C'
            },
            playbackratechange (rate) {
                this.playbackRate = rate
            },
            updateInfo (data) {
                if (this.$refs.videoText) this.$refs.videoText.innerHTML = data.currentHHMMSS + ' : ' + data.durationHHMMSS
                if (!this.$refs.seekbar.isSliding) this.$refs.seekbar.setValue(data.position)
            },
            onSeekValue (e) {
                var val = e.offsetX
                var max = parseInt(window.getComputedStyle(e.currentTarget).width)
                var requested = val / max
                PlayerEvents.$emit('seekNormalize', requested)
            }
        }
    }
</script>

<style scoped>
.bar {
    display: flex;
    flex-direction: row;
    padding: 0;
}

.section {
    border-left: 0.05em solid #2a2a2a;
}
.controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    /* height: 4.25em; */
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