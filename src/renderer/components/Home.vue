<template>
    <div class="page">
        <div class="container" style="flex-shrink: 0;flex-grow:1;">
            <control-menu></control-menu>
        </div>
        <div class="container">
            <control-bar ref="controlBar"></control-bar>
        </div>
    </div>
</template>

<script>
    import Utils from '@/mixins/Utils'
    import ControlBar from './Controls/ControlBar'
    import ControlMenu from './Controls/ControlMenu'

    export default {
        name: 'home',
        components: { ControlBar, ControlMenu },
        mixins: [ Utils ],
        mounted () {
            this.preventDraggables()
        }
    }
</script>
