<template>
    <div class="page overlay">
        <div class="container">
            <h1>{{ $t('settings') }}</h1>
            <button @click="$router.push('auth')" class="icon" @mousedown.stop v-bind:title="$t('auth')"><img src="static/controls/ic_vpn_key_white_48px.svg" /><span>{{$t('auth')}}</span></button>
            <button class="icon" @mousedown.stop @click="restartApp()" v-bind:title="$t('restart')"><img src="static/controls/ic_refresh_white_48px.svg" /><span>{{$t('restart')}}</span></button>
        </div>
        <div v-if="environment() === 'development'" class="container stretch">
            <h2>Tests</h2>
            <button @click="sendNotice()">Notice</button>
            <button class="icon" @mousedown.stop v-bind:title="$t('account')"><img src="static/controls/ic_account_circle_white_48px.svg" /><span>{{$t('account')}}</span></button>
            <button @click="playerRedirect('aspectRatio', 'fit')">FIT</button>
            <button @click="playerRedirect('aspectRatio', 'fill')">FILL</button>
            <button @click="playerRedirect('aspectRatio', 'stretch')">STRETCH</button>
            <button @click="playerRedirect('setQualityIndex', 0)">QUALITY 0</button>
            <button @click="playerRedirect('setQualityIndex', 1)">QUALITY 1</button>
            <button @click="playerRedirect('setQualityIndex', 2)">QUALITY 2</button>
            <p>
            <span>Selected Folder: </span><label>{{dir}}</label>
            </p>
            <button @click="dir = chooseFolder()">Choose Folder</button>
            <button @click="setWindowTitle('Test')">Set Window Title</button>
        </div>
        <div class="container">
            <button class="icon" @mousedown.stop @click="$router.replace('/')" v-bind:title="$t('back')"><img src="static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('back')}}</span></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "account": "Accounts",
        "auth": "Authenticate",
        "back": "Back",
        "restart": "Restart App",
        "settings": "Settings"
    }
}
</i18n>

<script>
    import Utils from '@/mixins/Utils'
    import Player from './Player/Player'
    import { PlayerEvents } from './Player/PlayerEvents'

    export default {
        name: 'settings',
        mixins: [ Utils ],
        data () {
            return {
                dir: ''
            }
        },
        components: { Player, PlayerEvents },
        mounted () {
            this.preventDraggables()
            this.$extendedInput.selectEl()
        },
        methods: {
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            },
            sendNotice () {
                Notification.requestPermission().then(result => {
                    if (result === 'granted') {
                        let myNotification = new Notification('Title', {
                            body: 'Lorem Ipsum Dolor Sit Amet'
                        })

                        myNotification.onclick = () => {
                            console.log('Notification clicked')
                        }
                    } else {
                        console.error('could not send notification')
                    }
                })
            }
        }
    }
</script>

<style>
    a {
        margin-right: 1em;
    }
</style>