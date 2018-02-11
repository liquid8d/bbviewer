<template>
    <div class="pills">
        <button @click="playerRedirect('setAudioPan', 'left')">L</button>
        <button @click="playerRedirect('setAudioPan', 'center')">C</button>
        <button @click="playerRedirect('setAudioPan', 'right')">R</button>
    </div>
</template>

<i18n>
{
    "en": {
        "mute": "Mute"
    }
}
</i18n>

<script>
    const { PlayerEvents } = require('../Player/PlayerEvents')
    export default {
        name: 'audio-pan',
        components: { PlayerEvents },
        methods: {
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            }
        }
    }
</script>
