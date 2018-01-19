<template>
    <div id="app">
      <router-view></router-view>
    </div>
</template>

<script>
import Utils from './mixins/Utils'
require('./assets/css/default.css')

export default {
    name: 'bbviewer',
    mixins: [ Utils ],
    mounted () {
        console.log('App Ready')
        this.setDraggable(document.querySelector('#app'))
        document.body.addEventListener('mousemove', this.unfocus())
    }
}
</script>

<style>
#app {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
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
  margin: 0;
  padding: 0.5em;
  height: 2.5em;
  width: 8em;
}

button:hover {
  background-color:green;
  color: rgb(89, 255, 47);
}
</style>
