<template>
    <div id="app">
        <backdrop style="z-index: 0;"></backdrop>
        <player ref="player"></player>
        <router-view style="z-index: 2;"></router-view>
    </div>
</template>

<script>
import Utils from './mixins/Utils'
import Backdrop from './components/Backdrop'
import Player from './components/Player/Player'
import router from './router'

export default {
    name: 'bbviewer',
    mixins: [ Utils ],
    components: { Backdrop, Player },
    router,
    mounted () {
        console.log('App Ready')
        this.setDraggable(document.querySelector('#app'))
        this.$extendedInput.init({
            home: function () {
                router.replace('/')
            }
        })
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

#app, .fill {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.page {
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  padding: 0;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.85);
  overflow: auto;
}

.page > .container {
  flex-grow: 0;
  padding: 0.5em;
}

.title {
  color: #18b353;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
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
