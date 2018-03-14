<template>
    <div class="player">
        <video></video>
    </div>
</template>

<script>
    import videojs from './videojs'
    export default {
        name: 'player',
        data () {
            return {
                handler: null
            }
        },
        mixins: [ videojs ]
    }
</script>

<style>
    .player, .vjs-v6, .vjs-v6 > video {
        position: absolute;
        width: 100%;
        height: 100%;
        min-width: 100%;
        min-height: 100%;
    }

    .pip {
        background: rgb(0,0,0);
        position: absolute;
        bottom: 3.25em;
        right: 1em;
        border: 1px solid rgb( 50, 50, 50 );
        width: 10em;
        height: 8em;
        min-width: 0;
        min-height: 0;        
        -webkit-box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.75);
        box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.75);
        pointer-events: none;
        z-index: 100;
    }
</style>