<template>
    <div>
        <button ref="back" class="icon" @click.stop.prevent="toggle" v-bind:title="$t('back')"><img src="~@/assets/controls/ic_more_horiz_white_48px.svg" /></button>
        <!-- <template v-if="this.environment() === 'development'"> -->
        <router-link class="icon" to="dev" tag="button" v-bind:title="$t('dev')"><img src="~@/assets/controls/ic_gavel_white_48px.svg" /></router-link>
        <!-- </template> -->
        <router-link class="icon" to="settings" tag="button" v-bind:title="$t('settings')"><img src="~@/assets/controls/ic_settings_white_48px.svg" /></router-link>
        <router-link class="icon" to="about" tag="button" v-bind:title="$t('about')"><img src="~@/assets/controls/ic_info_white_48px.svg" /></router-link>
    </div>
</template>

<i18n>
{
    "en": {
        "about": "About",
        "back": "Back",
        "dev": "Developer Tools",
        "settings": "Settings"
    }
}
</i18n>

<script>
    import Primary from './Primary'
    export default {
        name: 'secondary',
        components: { Primary },
        mounted () {
            this.$extendedInput.selectEl(this.$refs.back)
        },
        methods: {
            toggle () {
                this.$parent.view = Primary
            }
        }
    }
</script>