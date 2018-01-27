<template>
    <div>
        <button @click="$router.replace('browse')">Browse</button>
        <button @click="playerRedirect('stop')">Stop</button>
        <!-- <label>{{ streamInfo.currentTime }} / {{ streamInfo.duration }}</label> -->
        <button @click.stop.prevent="playerRedirect('seek', -300)">-300</button>
        <button @click.stop.prevent="playerRedirect('seek', -30)">-30</button>
        <button @click.stop.prevent="playerRedirect('pause')">Pause</button>
        <button @click.stop.prevent="playerRedirect('seek', 30)">30</button>
        <button @click.stop.prevent="playerRedirect('seek', 300)">300</button>
        <button @click.stop.prevent="playerRedirect('toggleMute')">Mute</button>
        <button @click.stop.prevent="toggle">More ></button>
    </div>
</template>

<script>
    import Secondary from './Secondary'
    const { PlayerEvents } = require('../Player/PlayerEvents')
    export default {
        name: 'primary',
        components: { Secondary, PlayerEvents },
        mounted () {
            this.$extendedInput.selectEl()
        },
        methods: {
            toggle () {
                this.$parent.view = Secondary
            },
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            }
        }
    }
</script>