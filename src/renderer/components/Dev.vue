<template>
    <div class="page">
        <div class="container">
            <h1>{{ $t('dev') }}</h1>
            <h2>Routes</h2>
                <button class="icon" @mousedown.stop v-bind:title="$t('account')"><img src="/static/controls/ic_account_circle_white_48px.svg" /><span>{{$t('account')}}</span></button>
                <button class="icon" @mousedown.stop v-bind:title="$t('flashbacks')"><img src="/static/controls/ic_history_white_48px.svg" /><span>{{$t('flashbacks')}}</span></button>
                <button class="icon" @mousedown.stop v-bind:title="$t('cast')"><img src="/static/controls/ic_cast_white_48px.svg" /><span>{{$t('cast')}}</span></button>
                <button @click="$router.push('auth')" class="icon" @mousedown.stop v-bind:title="$t('auth')"><img src="/static/controls/ic_vpn_key_white_48px.svg" /><span>{{$t('auth')}}</span></button>
            <h2>Player Control</h2>
                <button @click="playerRedirect('aspectRatio', '4:3')">ASPECT 4:3</button>
                <button @click="playerRedirect('aspectRatio', '16:9')">ASPECT 16:9</button>
                <button @click="playerRedirect('aspectRatio', '16:10')">ASPECT 16:10</button>
                <button @click="playerRedirect('volume', 0)">VOL0</button>
                <button @click="playerRedirect('volume', 0.5)">VOL50</button>
                <button @click="playerRedirect('volume', 1)">VOL100</button>
                <button @click="playerRedirect('setQualityIndex', 0)">QUALITY 0</button>
                <button @click="playerRedirect('setQualityIndex', 1)">QUALITY 1</button>
                <button @click="playerRedirect('setQualityIndex', 2)">QUALITY 2</button>
                <button @click="playerRedirect('goLive')">GO LIVE</button>
            <h2>App Tests</h2>
                <p>
                <span>Selected Folder: </span><label>{{dir}}</label>
                </p>
                <button @click="dir = chooseFolder()">Choose Folder</button>
                <button @click="resizeWindow(640,360)">Resize Window</button>
                <button @click="setWindowTitle('Test')">Set Window Title</button>
                <button class="icon" @mousedown.stop @click="restartApp()" v-bind:title="$t('restart')"><img src="/static/controls/ic_refresh_white_48px.svg" /><span>{{$t('restart')}}</span></button>
        </div>
        <div class="container">
            <router-link to="/" tag="button">{{ $t('back') }}</router-link>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "dev": "Dev Testing",
        "account": "Accounts",
        "auth": "Authenticate",
        "bookmarks": "Bookmarks",
        "cast": "Cast",
        "flashbacks": "Flashbacks",
        "restart": "Restart App"
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
            this.$extendedInput.selectEl()
        },
        mixins: [ Utils ]
    }
</script>
