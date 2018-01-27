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
        created () {
            console.log('created home')
        },
        mounted () {
            console.log('mounted home')
            this.preventDraggables()
            if (this.hideEnable) {
                this.$el.addEventListener('mousemove', this.showControls, false)
                this.$el.addEventListener('keydown', this.showControls, false)
            }
            this.showControls()
        },
        beforeDestroy () {
            console.log('unhooking hide controls')
            this.$el.removeEventListener('mousemove', this.showControls)
            this.$el.removeEventListener('keydown', this.showControls)
        },
        methods: {
            hideControls () {
                console.log('hide controls')
                this.$el.style.opacity = 0
            },
            showControls () {
                console.log('reset show controls')
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
    transition-property: opacity;
    transition-duration: 0.5s;
}
</style>
