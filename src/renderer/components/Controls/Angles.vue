<template>
    <div v-if="angles && angles.length > 0">
        <button  class="icon" @click="switchAngle(angle.id)" :title="angle.desc" :key="angle.id" v-for="angle in angles">{{angle.label}}</button>
    </div>
    <span v-else>{{$t('none')}}</span>
</template>

<i18n>
{
    "en": {
        "none": "None"
    }
}
</i18n>

<script>
    const { PlayerEvents } = require('../Player/PlayerEvents')
    export default {
        name: 'angles',
        mounted () {
            PlayerEvents.$on('provideAngles', this.onAngles)
            PlayerEvents.$on('stop', this.onStop)
        },
        beforeDestroy () {
            this.onStop()
            PlayerEvents.$off('provideAngles', this.onAngles)
            PlayerEvents.$off('stop', this.onStop)
        },
        data () {
            return {
                angles: []
            }
        },
        methods: {
            onAngles (angles) {
                this.angles = angles
            },
            onStop () {
                this.angles = []
            },
            switchAngle (angle) {
                console.log('switch angle ' + angle)
                PlayerEvents.$emit('switchAngle', angle)
            }
        }
    }
</script>