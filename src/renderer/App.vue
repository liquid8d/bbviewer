<template>
    <div id="app">
      <backdrop style="z-index: 0;"></backdrop>
      <player ref="player" style="z-index: 1;"></player>
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
  background-color: #444;
  width: 0.75em;
}

::-webkit-scrollbar-thumb {
  background-color: #999;
}

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

.pip {
    background: rgb(0,0,0);
    position: absolute;
    top: 1em;
    right: 1em;
    border: 1px solid rgb( 50, 50, 50 );
    width: 192px;
    height: 108px;
    -webkit-box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.75);
    pointer-events: none;
    z-index: 100;
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

a {
  text-decoration: none;
  color: #0b7734;
  margin-right: 1em;
}

a:hover {
  color: #18b353;
}

:focus, :hover:focus {
  outline: none;
  background-color:green;
  color: rgb(89, 255, 47);
}

button {
  display: inline-block;
  background: #444;
  border: none;
  text-align: center;
  margin: 0.25em;
  padding: 0.5em;
  height: 2.5em;
  cursor: pointer;
}
</style>
