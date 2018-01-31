<template>
    <bar>
        <template slot="left">
            <!-- <template v-if="this.environment() === 'development'"> -->
            <router-link class="icon" to="dev" tag="button" @mousedown.stop v-bind:title="$t('dev')"><img src="~@/assets/controls/ic_build_white_48px.svg" /></router-link>
            <!-- </template> -->
            <button class="icon" @mousedown.stop v-bind:title="$t('donate')" @click="$router.push('/donate')"><img src="~@/assets/controls/ic_monetization_on_white_48px.svg" /></button>
        </template>
        <template slot="center">
            <button class="icon" @mousedown.stop v-bind:title="$t('bookmarks')" @click="$router.push('/bookmarks')"><img src="~@/assets/controls/ic_bookmark_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="screenshot()" v-bind:title="$t('screenshot')"><img src="~@/assets/controls/ic_camera_alt_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="playerRedirect('pip')" v-bind:title="$t('pip')"><img src="~@/assets/controls/ic_picture_in_picture_alt_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="setWindowOnTop()" v-bind:title="$t('ontop')"><img src="~@/assets/controls/ic_flip_to_front_white_48px.svg" /></button>
            <button class="icon" @mousedown.stop @click="createNewWindow()" v-bind:title="$t('window')"><img src="~@/assets/controls/ic_open_in_new_white_48px.svg" /></button>
        </template>
        <template slot="right">
            <router-link class="icon" to="about" tag="button" @mousedown.stop v-bind:title="$t('about')"><img src="~@/assets/controls/ic_info_white_48px.svg" /></router-link>
            <router-link class="icon" to="settings" tag="button" @mousedown.stop @click="donate" v-bind:title="$t('settings')"><img src="~@/assets/controls/ic_settings_white_48px.svg" /></router-link>
            <button ref="back" class="icon" @mousedown.stop @click="toggle" v-bind:title="$t('back')"><img src="~@/assets/controls/ic_more_horiz_white_48px.svg" /></button>
        </template>
    </bar>
</template>

<i18n>
{
    "en": {
        "about": "About",
        "back": "Back",
        "bookmarks": "Bookmarks",
        "dev": "Developer Tools",
        "donate": "Donate",
        "ontop": "Toggle Window Pin",
        "pip": "Picture in Picture",
        "screenshot": "Screenshot",
        "settings": "Settings",
        "window": "New Window"
    }
}
</i18n>

<script>
    import Utils from '@/mixins/Utils'
    import Bar from '../Bar'
    import Primary from './Primary'
    const { PlayerEvents } = require('../Player/PlayerEvents')
    export default {
        name: 'secondary',
        components: { Bar, Primary },
        mixins: [ Utils ],
        mounted () {
            this.preventDraggables()
            this.$extendedInput.selectEl(this.$refs.back)
        },
        methods: {
            toggle () {
                this.$parent.view = Primary
            },
            donate () {
                this.$router.push('/donate')
            },
            playerRedirect (event, arg) {
                if (arg) PlayerEvents.$emit(event, arg); else PlayerEvents.$emit(event)
            }
        }
    }
</script>