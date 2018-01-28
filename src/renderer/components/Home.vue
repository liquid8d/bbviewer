<template>
    <div class="fill fade">
        <volume></volume>
        <speed></speed>
        <control-bar ref="controlBar"></control-bar>
    </div>
</template>

<script>
    import Utils from '@/mixins/Utils'
    import ControlBar from './Controls/ControlBar'
    import Volume from './Controls/Volume'
    import Speed from './Controls/Speed'

    var hideTimer

    export default {
        name: 'home',
        components: { ControlBar, Volume, Speed },
        data () {
            return {
                hideEnable: true,
                hideTimeout: 5000
            }
        },
        mixins: [ Utils ],
        mounted () {
            this.preventDraggables()
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
                this.$el.style.opacity = 0
            },
            showControls () {
                if (this.hideEnable) {
                    clearTimeout(hideTimer)
                    hideTimer = setTimeout(e => this.hideControls(), this.hideTimeout)
                    this.$el.style.opacity = 1
                }
            }
        }
    }
</script>

<style scoped>
.box {
    display: inline-block;
    position: relative;
    border-radius: 0.15em;
    height: 2.5em;
    max-width: 14em;
    background: #1c252b;
    margin: 0.25em;
    padding: 0.25em;
}

.fade {
    pointer-events: none;
    transition-property: opacity;
    transition-duration: 0.5s;
}

.fade > * {
    pointer-events: auto;
}

</style>
