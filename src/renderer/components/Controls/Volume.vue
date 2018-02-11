<template>
    <div>
        <button class="icon" @click.stop.prevent="playerRedirect('toggleMute')" v-bind:title="$t('mute')"><img src="~@/assets/controls/ic_volume_off_white_48px.svg" /></button>
        <vue-slider class="volume-slider" @valuechange="playerRedirect('volume', $event)"></vue-slider>
    </div>
</template>

<script>
    import Slider from './Slider'
    const { PlayerEvents } = require('../Player/PlayerEvents')
    export default {
        name: 'volume-control',
        components: { 'vue-slider': Slider, PlayerEvents },
        methods: {
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            }
        }
    }
</script>

<style scoped>
    .volume-slider {
        min-width: 4em;
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