<template>
    <button class="icon" @click.stop.prevent="playerRedirect('toggleMute')" v-bind:title="$t('mute')"><img src="~@/assets/controls/ic_volume_off_white_48px.svg" /></button>
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
        components: { PlayerEvents },
        methods: {
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            }
        }
    }
</script>