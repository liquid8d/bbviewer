<template>
    <div class="box">
        <vue-slider class="volume-slider" @valuechange="playerRedirect('volume', $event)"></vue-slider>
        <button class="icon" @click.stop.prevent="playerRedirect('toggleMute')" v-bind:title="$t('mute')"><img src="~@/assets/controls/ic_volume_off_white_48px.svg" /></button>
        <span>Audio Pan</span>
        <button class="icon" @click="playerRedirect('setAudioPan', 'left')">L</button>
        <button class="icon" @click="playerRedirect('setAudioPan', 'center')">C</button>
        <button class="icon" @click="playerRedirect('setAudioPan', 'right')">R</button>
    </div>
</template>

<i18n>
{
    "en": {
        "mute": "Mute"
    }
}
</i18n>

<script>
    import Slider from './Slider'
    const { PlayerEvents } = require('../Player/PlayerEvents')
    export default {
        name: 'audioControls',
        components: { 'vue-slider': Slider, PlayerEvents },
        methods: {
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            }
        }
    }
</script>

<style scoped>
    .box {
        display: inline-flex;
        justify-content: center;
        align-items:center;
        min-width: 8em;
    }
    .volume-slider {
        min-width: 6em;
    }
    .volume-slider >>> .slidebar {
        background-color:rgb(83, 83, 83);
    }
    .volume-slider >>> .slidebar > .value {
        background-color: rgb(41, 107, 207);
    }
    .volume-slider >>> .slidebar > .drag {
        background-color:rgb(48, 128, 248);
    }
</style>