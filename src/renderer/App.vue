<template>
    <div id="app" @mouseleave="hideControls">
        <div v-if="$store.state.isElectron" ref="titlebar" class="titlebar">
            <span>{{$t('title')}}</span>
            <img src="static/controls/ic_remove_white_48px.svg" @click.stop="minimizeWindow()" />
            <img src="static/controls/ic_settings_overscan_white_48px.svg" @click.stop="maximizeWindow()" />
            <img src="static/controls/ic_clear_white_48px.svg" @click.stop="closeWindow()" />
        </div>
        <div class="app-container">
            <backdrop style="z-index: 0;"></backdrop>
            <player ref="player"></player>
            <router-view style="z-index: 2;"></router-view>
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
import Player from './components/Player/Player'
import router from './router'

const { PlayerEvents } = require('./components/Player/PlayerEvents')

var hideTimer

export default {
    name: 'bbviewer',
    mixins: [ Utils ],
    components: { Backdrop, Player, PlayerEvents },
    router,
    data () {
        return {
            hideEnable: true,
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
        if (this.hideEnable) {
            this.$el.addEventListener('mousemove', this.showControls, false)
            this.$extendedInput.Keyboard.$on('key', this.showControls)
            this.$extendedInput.Gamepad.$on('key', this.showControls)
        }
        this.showControls()
    },
    beforeDestroy () {
        this.$el.removeEventListener('mousemove', this.showControls)
        this.$extendedInput.Keyboard.$off('key', this.showControls)
        this.$extendedInput.Gamepad.$off('key', this.showControls)
    },
    methods: {
        hideControls () {
            if (this.hideEnable) {
                if (this.$refs.titlebar) this.$refs.titlebar.style.display = 'none'
                if (document.querySelector('.controls')) document.querySelector('.controls').style.display = 'none'
                PlayerEvents.$emit('showMenu', false)
            }
        },
        showControls () {
            clearTimeout(hideTimer)
            hideTimer = setTimeout(e => this.hideControls(), this.hideTimeout)
            if (this.$refs.titlebar) this.$refs.titlebar.style.display = 'flex'
            if (document.querySelector('.controls')) document.querySelector('.controls').style.display = ''
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
    background: rgba(100,100,100,1.0);
}
::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(100,100,100,0.75); 
}
::-webkit-scrollbar-corner { background: rgba(0,0,0,0); }

#app {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 0.05em solid #111;
}

.app-container {
    position: relative;
    height: 100%;
}

/* Base page css */
.page {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    flex-grow: 1;
    position: absolute;
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
}

.page.overlay {
    background-color: rgba(0, 0, 0, 0.85);
}

.page > .container {
    flex-direction: column;
    padding: 0.5em;
}

.page > .container.stretch {
    flex-grow: 1;
    overflow: auto;
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
</style>
