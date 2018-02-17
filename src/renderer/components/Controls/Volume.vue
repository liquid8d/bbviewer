<template>
    <div>
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