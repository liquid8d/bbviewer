<template>
    <div class="page">
        <div class="container" style="flex-shrink: 0;flex-grow:1;">
            <angles></angles>
        </div>
        <div class="container">
            <control-bar ref="controlBar"></control-bar>
        </div>
    </div>
</template>

<script>
    import Utils from '@/mixins/Utils'
    import Angles from './Controls/Angles'
    import ControlBar from './Controls/ControlBar'

    export default {
        name: 'home',
        components: { ControlBar, Angles },
        mixins: [ Utils ],
        mounted () {
            this.preventDraggables()
        }
    }
</script>
