<template>
    <div id="app" @mouseleave="onMouseLeave">
        <div v-if="$store.state.isElectron" ref="titlebar" class="titlebar">
            <span>{{$t('title')}}</span>
            <img src="static/controls/ic_flip_to_front_white_48px.svg" @click.stop="setWindowOnTop()" />
            <img src="static/controls/ic_remove_white_48px.svg" @click.stop="minimizeWindow()" />
            <img src="static/controls/ic_zoom_out_map_white_48px.svg" @click.stop="maximizeWindow()" />
            <img src="static/controls/ic_clear_white_48px.svg" @click.stop="closeWindow()" />
        </div>
        <div v-if="$store.state.isElectron" class="app-border"></div>
        <div class="app-container">
            <backdrop style="z-index: 0;"></backdrop>
            <player ref="player"></player>
            <router-view style="z-index: 2;"></router-view>
            <notification v-if="this.activeNotice" ref="notice" class="notice" v-bind="this.activeNotice"></notification>
            <div id="debug">Debug</div>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "title": "BBViewer"
    }
}
</i18n>

<script>
import Utils from './mixins/Utils'
import Backdrop from './components/Backdrop'
import Notification from './components/Notifications/Notification'
import Player from './components/Player/Player'
import router from './router'

const { PlayerEvents } = require('./components/Player/PlayerEvents')

var hideTimer

export default {
    name: 'bbviewer',
    mixins: [ Utils ],
    components: { Backdrop, Player, PlayerEvents, Notification },
    router,
    data () {
        return {
            activeNotice: null,
            hideLeave: true,
            hideDelay: true,
            hideTimeout: 4000
        }
    },
    mounted () {
        console.log('App Ready')
        this.$extendedInput.init({
            home: function () {
                router.replace('/')
            }
        })
        this.setDraggable(document.querySelector('#app'))

        PlayerEvents.$on('showNotice', this.showNotice)
        PlayerEvents.$on('clearNotice', this.clearNotice)

        this.$el.addEventListener('mousemove', this.showControls, false)
        this.$extendedInput.Keyboard.$on('key', this.showControls)
        this.$extendedInput.Gamepad.$on('key', this.showControls)
        this.showControls()

        // WEB DEV NOTICE
        if (!this.$store.state.isElectron) {
            this.showNotice({
                title: '<font color="red">WIP Version</font>',
                desc: 'This is a development test version of a future BBViewer revamp. Not all media or features are available in the browser version.'
            })
        }
    },
    beforeDestroy () {
        this.$el.removeEventListener('mousemove', this.showControls)
        this.$extendedInput.Keyboard.$off('key', this.showControls)
        this.$extendedInput.Gamepad.$off('key', this.showControls)

        PlayerEvents.$off('notice', this.showNotice)
        PlayerEvents.$off('notice', this.clearNotice)
    },
    methods: {
        onMouseLeave () {
            if (this.hideLeave) {
                if (this.$refs.titlebar) this.$refs.titlebar.style.display = 'none'
                if (document.querySelector('.controls')) document.querySelector('.controls').style.display = 'none'
                PlayerEvents.$emit('showMenu', false)
            }
        },
        onDelay () {
            if (this.hideDelay) {
                if (this.$refs.titlebar) this.$refs.titlebar.style.display = 'none'
                if (document.querySelector('.controls')) document.querySelector('.controls').style.display = 'none'
                PlayerEvents.$emit('showMenu', false)
            }
        },
        showNotice (data) {
            this.activeNotice = data
        },
        clearNotice () {
            this.activeNotice = null
        },
        showControls () {
            if (this.$refs.titlebar) this.$refs.titlebar.style.display = 'flex'
            if (document.querySelector('.controls')) document.querySelector('.controls').style.display = ''
            clearTimeout(hideTimer)
            hideTimer = setTimeout(e => this.onDelay(), this.hideTimeout)
        }
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

html, body {
  background-color: #000;
  color: #999;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 18px;
}

::-webkit-scrollbar {
    width: 0.5em;
}

::-webkit-scrollbar-track {
    background: rgba(50,50,50,1.0);
    border: 1px solid rgba(50,50,50,0.8);
}
::-webkit-scrollbar-thumb {
    background: rgb(75, 75, 75);
}
::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(75,75,75,0.75); 
}
::-webkit-scrollbar-corner { background: rgba(0,0,0,0); }

#debug {
    display: none;
    position: absolute;
    top: 1em;
    left: 1em;
    right: 1em;
    font-size: 0.75em;
    overflow: hidden;
    background: rgba(10,10,10,0.8);
    padding: 1em;
    word-wrap: break-word;
}

#app {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.app-border {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: 0 0 0 0.05em #111 inset;
    z-index: 99;
    pointer-events: none;
}

.app-container {
    position: relative;
    height: 100%;
    overflow: hidden;
}

/* Base page css */
.page {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    flex-grow: 1;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
}

.page.overlay {
    background-color: rgba(0, 0, 0, 0.7);
}

.page.cover {
    background-color: #111;
}

.page > .container {
    flex-direction: column;
    flex-shrink: 0;
    flex-grow: 0;
    padding: 0.5em;
    overflow: auto;
}

.page > .container.stretch {
    flex-shrink: 1;
    flex-grow: 1;
}

/* Window title bar when using Electron */
.titlebar {
    display: flex;
    flex-direction: row;
    background-color: #1b1f22;
    position: relative;
    flex-shrink: 0;
    flex-grow: 0;
    padding: 0.3em;
    width: 100%;
    height: 1.75em;
}

.titlebar > span {
    display: block;
    flex-shrink: 0;
    flex-grow: 1;
    margin: 0;
    padding: 0;
    font-size: 0.75em;
    line-height: 1.75em;
    color:#18b353;
}

.titlebar > img {
    flex-grow: 0;
    width: 1em;
    height: 1.25em;
    margin: 0 0.3em 0 0.3em;
    pointer-events: all;
    cursor: pointer;
}

.notice {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    min-width: 10em;
    max-width: 33%;
    z-index: 2;
}
.notice .options {
    display:flex;
    justify-content: center;
}

.pills {
    display: inline;
    padding: 0.5em;
}

.pills > button {
    float: left;
    border-radius: 0;
    min-width: 2.5em;
    margin: 0;
}

.pills > button:first-child {
    border-radius: 0.5em 0 0 0.5em;
    padding-left: 0.5em;
}

.pills > button:last-child {
    border-radius: 0 0.5em 0.5em 0;
}

h1, h2, h3 {
    color: #18b353;
    font-size: 1.5em;
    font-weight: bold;
}

span, label, a {
    font-size: 0.75em;
    color: #4cc078;
}

a {
  text-decoration: none;
  margin-right: 1em;
}

:focus, :hover:focus {
    outline: none;
    background-color:#18b353;
    color: #efefef;
}

button {
    display: inline-block;
    background: #111;
    border-radius: 0.15em;
    color: #999;
    border: none;
    text-align: center;
    margin: 0.25em;
    padding: 0.5em;
    height: 2.5em;
    cursor: pointer;
}

button.icon {
    flex-grow: 0;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: bold;
    min-width: 2.5em;
    /* -webkit-filter: drop-shadow( 2px 2px 3px #000 ); 
    filter: drop-shadow( 2px 2px 3px #000 ); */
}

button.icon > span {
    margin-left: 0.5em;
    font-size: 0.8em;
}

button.icon:focus > span {
    color: #efefef;
}

button.icon > img {
    width: 1.5em;
    height: 1.5em;
}

</style>
