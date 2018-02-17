<template>
    <div class="pills">
        <button @click="playerRedirect('setAudioPan', 'left')">{{$t('left')}}</button>
        <button @click="playerRedirect('setAudioPan', 'center')">{{$t('center')}}</button>
        <button @click="playerRedirect('setAudioPan', 'right')">{{$t('right')}}</button>
    </div>
</template>

<i18n>
{
    "en": {
        "left": "L",
        "center": "C",
        "right": "R"
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
