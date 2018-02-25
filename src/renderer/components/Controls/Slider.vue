<template>
    <div class="container" @mousedown.prevent.stop="onStartSlide" @mousemove.prevent.stop="onSlide" @mouseup="onEndSlide" @mouseleave="onCancelSlide">
        <div ref="slidebar" class="slidebar">
            <div ref="value" class="value"></div>
            <div ref="drag" class="drag" :style="{ width: dragSize + 'px', height: dragSize + 'px' }"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            immediate: {
                default: true
            },
            dragSize: {
                default: 12
            }
        },
        data () {
            return {
                isSliding: false,
                value: {
                    default: 1.0
                }
            }
        },
        computed: {
            current: {
                set (val) {
                    if (val === this.value) return
                    var percent = (val * 100) + '%'
                    this.$refs.value.style.width = percent
                    this.value = val
                    this.$emit('valuechange', this.current)
                },
                get () {
                    return this.value
                }
            }
        },
        methods: {
            onStartSlide (e) {
                if (this.isSliding) return
                this.isSliding = true
                this.updateSlide(e)
            },
            onSlide (e) {
                if (!this.isSliding) return
                this.updateSlide(e)
            },
            onEndSlide (e) {
                if (!this.isSliding) return
                this.isSliding = false
                this.updateSlide(e)
                this.$emit('endslide', e)
            },
            onCancelSlide (e) {
                if (!this.isSliding) return
                this.isSliding = false
                this.updateDrag(this.current)
            },
            updateSlide (e) {
                var val = e.offsetX
                var max = parseInt(window.getComputedStyle(e.currentTarget).width)
                var requested = val / max
                this.updateDrag(requested)
                if (this.immediate || (!this.immediate && !this.isSliding)) this.setValue(requested)
            },
            updateDrag (val) {
                var position = parseInt(window.getComputedStyle(this.$refs.slidebar).width) * val - (this.dragSize / 2)
                this.$refs.drag.style.left = position + 'px'
                this.$refs.drag.style.top = '-4px'
            },
            clamp (num, min, max) {
                return num <= min ? min : num >= max ? max : num
            },
            setValue (val) {
                this.current = this.clamp(val, 0, 1)
                this.updateDrag(val)
            },
            onResize (e) {
                this.updateDrag(this.current)
            }
        },
        beforeMount: function () {
            window.addEventListener('resize', this.onResize)
        },
        beforeDestroy: function () {
            window.removeEventListener('resize', this.onResize)
        },
        mounted () {
            this.setValue(this.value)
        }
    }
</script>

<style scoped>
    .container {
        position: relative;
        margin: 0 0.5em 0 0.5em;
        padding: 0.75em 0 0.75em 0;
        height: 0.75em;
        overflow: hidden;
    }
    .slidebar {
        flex-grow: 1;
        position: absolute;
        top: calc(45%);
        left: 0;
        right: 0;
        height: 0.2em;
        margin: 0 0.25em 0 0.25em;
        background: rgb( 50, 50, 50 );
        pointer-events: none;
    }

    .slidebar > .value {
        position: absolute;
        width: 0;
        height: 100%;
        background: #18b353;
        pointer-events: none;
    }

    .drag {
        position: absolute;
        border-radius: 50%;
        border: 1px solid rgb( 20, 20, 20 );
        background: #18b353;
        left: -2px;
        top: -5px;
        width: 16px;
        height: 16px;
        pointer-events: none;
    }
</style>