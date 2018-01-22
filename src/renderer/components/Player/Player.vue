<template>
    <div class="player">
        <video></video>
    </div>
</template>

<script>
    import videojs from './videojs'
    export default {
        name: 'player',
        mixins: [ videojs ]
    }
</script>

<style>
    .player, .vjs-v6, .vjs-v6 > video {
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        min-width: 100%;
        min-height: 100%;
    }
</style>