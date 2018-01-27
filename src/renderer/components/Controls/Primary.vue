<template>
    <div>
        <button class="icon" ref="browse" @click="$router.replace('browse')" v-bind:title="$t('browse')"><img src="~@/assets/controls/ic_video_library_white_48px.svg" /></button>
        <button class="icon" @click="playerRedirect('stop')" v-bind:title="$t('stop')"><img src="~@/assets/controls/ic_stop_white_48px.svg" /></button>
        <!-- <label>{{ streamInfo.currentTime }} / {{ streamInfo.duration }}</label> -->
        <button class="icon" @click.stop.prevent="playerRedirect('seek', -300)" v-bind:title="$t('seek')"><img src="~@/assets/controls/ic_skip_previous_white_48px.svg" /></button>
        <button class="icon" @click.stop.prevent="playerRedirect('seek', -30)" v-bind:title="$t('seek')"><img src="~@/assets/controls/ic_chevron_left_white_48px.svg" /></button>
        <button class="icon" @click.stop.prevent="playerRedirect('pause')" v-bind:title="$t('seek')"><img src="~@/assets/controls/ic_pause_white_48px.svg" /></button>
        <button class="icon" @click.stop.prevent="playerRedirect('seek', 30)" v-bind:title="$t('seek')"><img src="~@/assets/controls/ic_chevron_right_white_48px.svg" /></button>
        <button class="icon" @click.stop.prevent="playerRedirect('seek', 300)" v-bind:title="$t('seek')"><img src="~@/assets/controls/ic_skip_next_white_48px.svg" /></button>
        <button class="icon" @click.stop.prevent="playerRedirect('pip')" v-bind:title="$t('pip')"><img src="~@/assets/controls/ic_picture_in_picture_alt_white_48px.svg" /></button>
        <button class="icon" @click.stop.prevent="fullscreen()" v-bind:title="$t('fullscreen')"><img src="~@/assets/controls/ic_fullscreen_white_48px.svg" /></button>
        <button class="icon" @click.stop.prevent="toggle" v-bind:title="$t('more')"><img src="~@/assets/controls/ic_more_horiz_white_48px.svg" /></button>
    </div>
</template>

<i18n>
{
    "en": {
        "browse": "Browse",
        "fullscreen": "Fullscreen",
        "more": "More",
        "pip": "Picture in Picture",
        "seek": "Seek",
        "stop": "Stop"
    }
}
</i18n>

<script>
    import Utils from '@/mixins/Utils'
    import Secondary from './Secondary'
    const { PlayerEvents } = require('../Player/PlayerEvents')
    export default {
        name: 'primary',
        components: { Secondary, PlayerEvents },
        mixins: [ Utils ],
        mounted () {
            this.$extendedInput.selectEl(this.$refs.browse)
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