<template>
    <div class="box">
        <span>Speed</span>
        <button class="icon" @click="playerRedirect('playbackRate', 0.75)">0.75</button>
        <button class="icon" @click="playerRedirect('playbackRate', 1)">1</button>
        <button class="icon" @click="playerRedirect('playbackRate', 1.25)">1.25</button>
        <button class="icon" @click="playerRedirect('playbackRate', 1.5)">1.5</button>
        <button class="icon" @click="playerRedirect('playbackRate', 2)">2</button>
    </div>
</template>

<script>
    const { PlayerEvents } = require('../Player/PlayerEvents')
    export default {
        components: { PlayerEvents },
        methods: {
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            }
        }
    }
</script>