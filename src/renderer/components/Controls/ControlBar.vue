<template>
    <div class="controls">
        <div class="bar">
            <div style="flex-grow:1">
                <angles></angles>
            </div>
            <div class="section">
                <button class="icon" @click="$router.replace('bookmarks')" v-bind:title="$t('bookmarks')"><img src="static/controls/ic_bookmark_white_48px.svg" /></button>
                <button class="icon" @click="$router.replace('flashbacks')" v-bind:title="$t('flashbacks')"><img src="static/controls/ic_history_white_48px.svg" /></button>
                <button class="icon" @click="playerRedirect('toggleAudioPan')" v-bind:title="$t('pan')"><img src="static/controls/ic_speaker_white_48px.svg" /><span>{{audioPan}}</span></button>
                <button class="icon" @click="playerRedirect('toggleSpeed')" v-bind:title="$t('playbackRate')"><img src="static/controls/ic_timelapse_white_48px.svg" /><span>{{playbackRate}}</span></button>
                <button class="icon" @click="$router.replace('cast')" v-bind:title="$t('cast')"><img src="static/controls/ic_cast_white_48px.svg" /></button>
            </div>
            <div class="section">
                <button class="icon" @click="setWindowOnTop()" v-bind:title="$t('ontop')"><img src="static/controls/ic_flip_to_front_white_48px.svg" /></button>
                <button class="icon" @click="playerRedirect('pip')" v-bind:title="$t('pip')"><img src="static/controls/ic_picture_in_picture_alt_white_48px.svg" /></button>
            </div>
        </div>
        <div ref="seekbar" class="seekbar" @mouseover.prevent.stop @click.prevent.stop="onSeekValue">
            <div ref="seekvalue" class="seekvalue"></div>
        </div>
        <label ref="videoText" class="video-text"></label>
        <component v-bind:is="view"></component>
    </div>
</template>

<i18n>
{
    "en": {
        "bookmarks": "Bookmarks",
        "cast": "Cast",
        "flashbacks": "Flashbacks",
        "ontop": "Toggle On Top",
        "pan": "Audio Pan",
        "pip": "Picture in Picture",
        "playbackRate": "Playback Speed"
    }
}
</i18n>

<script>
    import Primary from './Primary'
    import router from '../../router'
    import Angles from './Angles'
    import Utils from '@/mixins/Utils'

    const { PlayerEvents } = require('../Player/PlayerEvents')
    export default {
        name: 'controlBar',
        router,
        components: { Angles },
        mixins: [ Utils ],
        data () {
            return {
                audioPan: 'C',
                playbackRate: '1.0',
                view: Primary
            }
        },
        mounted () {
            PlayerEvents.$on('streamInfo', this.updateInfo)
            PlayerEvents.$on('audiopanchange', this.audiopanchange)
            PlayerEvents.$on('playbackratechange', this.playbackratechange)
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
                this.$refs.videoText.innerHTML = data.currentHHMMSS + ' : ' + data.durationHHMMSS
                this.$refs.seekvalue.style.width = (data.position * 100) + '%'
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

.seekbar {
    position: relative;
    width: 100%;
    height: 0.2em;
    background: #444;
    cursor: pointer;
}

.seekvalue {
    position: absolute;
    display: inline-block;
    width: 0;
    height: 0.2em;
    background:#18b353;
    pointer-events: none;
}

.video-text {
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: relative;
    margin: 0.25em;
    height: 1em;
}
</style>