<template>
    <div class="page">
        <div class="container">
            <h2>Browse</h2>
            <button @click="play('http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4')">MP4</button>
            <button @click="play('http://dash.edgesuite.net/akamai/test/caption_test/ElephantsDream/elephants_dream_480p_heaac5_1.mpd')">DASH</button>
            <button @click="play('https://www.youtube.com/watch?v=8ndhidEmUbI')">YT</button>
            <button @click="play('https://s3.amazonaws.com/_bc_dml/example-content/bipbop-advanced/bipbop_16x9_variant.m3u8')">HLS</button>
            <button @click="play('http://cdn3.videos.bloomberg.com/btv/us/master.m3u8')">HLS Live</button>
            <button @click="play('https://vimeo.com/channels/360vr/207528129')">Vimeo360</button>
            <button @click="play('rtmp://cp67126.edgefcs.net/ondemand/mediapm/osmf/content/test/akamai_10_year_f8_512K')">RTMP (requires flash)</button>
        </div>
        <div class="container">
            <router-link to="/" tag="button">Back</router-link>
        </div>
    </div>
</template>

<script>
    const { PlayerEvents } = require('./Player/PlayerEvents')
    export default {
        name: 'browse',
        components: { PlayerEvents },
        methods: {
            play (src) {
                this.playerRedirect('play', src)
                this.$router.push('/')
            },
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            }
        }
    }
</script>