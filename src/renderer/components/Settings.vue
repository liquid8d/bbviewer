<template>
    <div class="page cover">
        <div class="container stretch">
            <dynamic-form :form="form"></dynamic-form>
        </div>
        <!--
        <div v-if="environment() === 'development'" class="container stretch">
            <h2>Tests</h2>
            <button @click="$router.push('auth')" class="icon" @mousedown.stop v-bind:title="$t('auth')"><img src="static/controls/ic_vpn_key_white_48px.svg" /><span>{{$t('auth')}}</span></button>
            <button class="icon" @mousedown.stop @click="restartApp()" v-bind:title="$t('restart')"><img src="static/controls/ic_refresh_white_48px.svg" /><span>{{$t('restart')}}</span></button>
            <button @click="toggleDebug">Toggle Debug</button>
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
        <div v-if="showFlash" class="container pad">
            <header>Flash test</header>
            <webview v-if="$store.isElectron" class="flash" src="http://wwwimages.adobe.com/www.adobe.com/swf/software/flash/about/flash_about_793x170.swf" plugins></webview>
            <object v-if="!$store.isElectron" class="flash" type="application/x-shockwave-flash" data="http://wwwimages.adobe.com/www.adobe.com/swf/software/flash/about/flash_about_793x170.swf" style="width: auto; height: auto;"> <param name="movie" value="http://wwwimages.adobe.com/www.adobe.com/swf/software/flash/about/flash_about_793x170.swf" /><param name="wmode" value="transparent" /><param name="FlashVars" value="" /><param name="quality" value="high" /><param name="menu" value="false" /></object>
        </div>
        -->
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
    import { mapState } from 'vuex'
    import DynamicForm from './DynamicForm'
    import Utils from '@/mixins/Utils'
    import Player from './Player/Player'
    import router from '../router'
    import { PlayerEvents } from './Player/PlayerEvents'

    export default {
        name: 'settings',
        mixins: [ Utils ],
        data () {
            return {
                dir: '',
                showFlash: false,
                form: {
                    getValue: this.getValue,
                    setValue: this.setValue,
                    items: [
                        {
                            id: 'display',
                            label: 'Display',
                            items: [
                                {
                                    id: 'hideLeave',
                                    type: 'checkbox',
                                    label: 'Hide Leave',
                                    desc: 'Hide window title and controls when the mouse leaves the window'
                                },
                                {
                                    id: 'hideDelay',
                                    type: 'checkbox',
                                    label: 'Hide Delay',
                                    desc: 'Hide window title and controls after a set delay'
                                },
                                {
                                    id: 'hideTimeout',
                                    type: 'number',
                                    label: 'Hide Timeout',
                                    desc: 'The delay, in milliseconds, before window title and controls are hidden if hide delay is enabled'
                                }
                            ]
                        },
                        {
                            id: 'misc',
                            label: 'Misc',
                            items: [
                                {
                                    id: 'flashcheck',
                                    label: 'Flash Check',
                                    type: 'button',
                                    desc: 'Check if Flash is installed',
                                    onclick () {
                                        router.push('flashcheck')
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        },
        computed: mapState([
            'hideLeave',
            'hideDelay',
            'hideTimeout'
        ]),
        components: { 'dynamic-form': DynamicForm, Player, PlayerEvents },
        mounted () {
            this.preventDraggables()
            this.$extendedInput.selectEl()
        },
        methods: {
            getValue (e) {
                console.log(e.target.name + ': ' + this[e.target.name])
                return this[e.target.name]
            },
            setValue (e) {
                if (e.target) {
                    switch (e.target.type) {
                    case 'checkbox':
                        this.$store.commit(e.target.name, e.target.checked)
                        break
                    case 'number':
                        this.$store.commit(e.target.name, e.target.value)
                        break
                    case 'select':
                        this.$store.commit(e.target.name, e.target.selectedOptions[0].value)
                        break
                    }
                }
            },
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
            },
            toggleDebug () {
                if (document.getElementById('debug')) {
                    document.getElementById('debug').style.display = (document.getElementById('debug').style.display !== 'block') ? 'block' : 'none'
                }
            }
        }
    }
</script>

<style scoped>
    a {
        margin-right: 1em;
    }
    .pad {
        margin: 0 2em 0 2em;
    }
    .flash {
        max-height: 3em;
    }
</style>