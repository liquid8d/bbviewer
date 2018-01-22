<template>
    <control-bar></control-bar>
</template>

<script>
  import Utils from '@/mixins/Utils'
  import ControlBar from './ControlBar/ControlBar'
  // import { PlayerEvents } from './Player/PlayerEvents'

  export default {
      name: 'home',
      components: { ControlBar },
      mixins: [ Utils ],
      mounted () {
          this.preventDraggables()
      }
  }
</script>
