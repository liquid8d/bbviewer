<template>
    <div class="page">
        <div class="container" style="flex-shrink: 0;flex-grow:1;">
            <angles></angles>
            <audio-pan ref="audioPan"></audio-pan>
            <speed ref="playbackSpeed"></speed>
        </div>
        <div class="container">
            <control-bar ref="controlBar"></control-bar>
        </div>
    </div>
</template>

<script>
    import Utils from '@/mixins/Utils'
    import Angles from './Controls/Angles'
    import AudioPan from './Controls/AudioPan'
    import ControlBar from './Controls/ControlBar'
    import Speed from './Controls/Speed'

    const { PlayerEvents } = require('./Player/PlayerEvents')

    export default {
        name: 'home',
        components: { ControlBar, Angles, AudioPan, Speed },
        mixins: [ Utils ],
        mounted () {
            this.preventDraggables()
            PlayerEvents.$on('toggleAudioPan', this.toggleAudioPan)
            PlayerEvents.$on('toggleSpeed', this.toggleSpeed)
        },
        methods: {
            toggleAudioPan () {
                if (this.$refs.audioPan) this.$refs.audioPan.$el.style.display = (this.$refs.audioPan.$el.style.display === 'none') ? '' : 'none'
            },
            toggleSpeed () {
                if (this.$refs.playbackSpeed) this.$refs.playbackSpeed.$el.style.display = (this.$refs.playbackSpeed.$el.style.display === 'none') ? '' : 'none'
            }
        }
    }
</script>
