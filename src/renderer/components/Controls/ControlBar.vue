<template>
    <div class="controls">
        <div ref="seekbar" class="seekbar" @mouseover.prevent.stop @click.prevent.stop="onSeekValue">
            <div ref="seekvalue" class="seekvalue"></div>
        </div>
        <label ref="videoText" class="video-text"></label>
        <component v-bind:is="view"></component>
    </div>
</template>

<script>
    import Primary from './Primary'
    import router from '../../router'
    const { PlayerEvents } = require('../Player/PlayerEvents')
    export default {
        name: 'controlBar',
        router,
        data () {
            return {
                view: Primary
            }
        },
        mounted () {
            PlayerEvents.$on('streamInfo', this.updateInfo)
        },
        beforeDestroy () {
            PlayerEvents.$off('streamInfo', this.updateInfo)
        },
        methods: {
            updateInfo (data) {
                this.$refs.videoText.innerHTML = data.currentHHMMSS + ' : ' + data.durationHHMMSS
                this.$refs.seekvalue.style.width = (data.position * 100) + '%'
            },
            onSeekValue (e) {
                var val = e.offsetX
                var max = parseInt(window.getComputedStyle(e.currentTarget).width)
                var requested = val / max
                PlayerEvents.$emit('seekNormalize', requested)
            }
        }
    }
</script>

<style scoped>
.controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4.25em;
    background: #1b1f22;
}

.controls >>> button {
    background: none;
}

.controls >>> button:hover {
    background-color:#666;
}

.controls >>> button:focus {
    background-color:#18b353;
}

.seekbar {
    position: relative;
    width: 100%;
    height: 0.2em;
    background: #444;
    cursor: pointer;
}

.seekvalue {
    position: absolute;
    display: inline-block;
    width: 0;
    height: 0.2em;
    background:#18b353;
    pointer-events: none;
}

.video-text {
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: relative;
    margin: 0.5em;
    height: 1em;
}
</style>