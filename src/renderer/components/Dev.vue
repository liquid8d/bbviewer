<template>
    <div class="page">
        <div class="container">
            <h1>{{ $t('dev') }}</h1>
            <h2>Player Control</h2>
            <button @click="playerRedirect('playbackRate', 0.5)">SPEED 0.5</button>
            <button @click="playerRedirect('playbackRate', 1)">SPEED 1</button>
            <button @click="playerRedirect('playbackRate', 2)">SPEED2</button>
            <button @click="playerRedirect('aspectRatio', '4:3')">ASPECT 4:3</button>
            <button @click="playerRedirect('aspectRatio', '16:9')">ASPECT 16:9</button>
            <button @click="playerRedirect('aspectRatio', '16:10')">ASPECT 16:10</button>
            <button @click="playerRedirect('volume', 0.5)">VOL50</button>
            <button @click="playerRedirect('volume', 1)">VOL100</button>
            <button @click="playerRedirect('setQualityIndex', 0)">QUALITY 0</button>
            <button @click="playerRedirect('setQualityIndex', 1)">QUALITY 1</button>
            <button @click="playerRedirect('setQualityIndex', 2)">QUALITY 2</button>
            <button @click="playerRedirect('goLive')">GO LIVE</button>
        </div>
        <div class="container">
            <h2>App Tests</h2>
            <p>
            <span>Selected Folder: </span><label>{{dir}}</label>
            </p>
            <button @click.stop.prevent="fullscreen()">Fullscreen</button>
            <button @click="dir = chooseFolder()">Choose Folder</button>
            <button @click="screenshot()">Screenshot</button>
            <button @click="createNewWindow()">New Window</button>
            <button @click="resizeWindow(640,360)">Resize Window</button>
            <button @click="setWindowTitle('Test')">Set Window Title</button>
            <button @click="restartApp()">Restart</button>
            <button @click="setWindowOnTop()">Toggle OnTop</button>
        </div>
        <div class="container">
            <router-link to="/" tag="button">{{ $t('back') }}</router-link>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "dev": "Dev Testing"
    }
}
</i18n>

<script>
    import Utils from '@/mixins/Utils'
    import Player from './Player/Player'
    import { PlayerEvents } from './Player/PlayerEvents'
    export default {
        name: 'dev',
        data () {
            return {
                dir: ''
            }
        },
        components: { Player, PlayerEvents },
        methods: {
            play (src) {
                this.playerRedirect('play', src)
                this.$router.push('/')
            },
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            }
        },
        mounted () {
            this.preventDraggables()
        },
        mixins: [ Utils ]
    }
</script>
