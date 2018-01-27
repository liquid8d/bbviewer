<template>
    <div>
        <button @click.stop.prevent="toggle">< Back</button>
        <button @click="playerRedirect('playbackRate', 0.5)">SPEED 0.5</button>
        <button @click="playerRedirect('playbackRate', 1)">SPEED 1</button>
        <button @click="playerRedirect('playbackRate', 2)">SPEED2</button>
        <!-- <template v-if="this.environment() === 'development'"> -->
        <router-link to="dev" tag="button">Dev</router-link>
        <!-- </template> -->
        <router-link to="settings" tag="button">{{ $t('settings') }}</router-link>
        <router-link to="about" tag="button">{{ $t('about') }}</router-link>
    </div>
</template>

<script>
    import Primary from './Primary'
    export default {
        name: 'secondary',
        components: { Primary },
        mounted () {
            this.$extendedInput.selectEl()
        },
        methods: {
            toggle () {
                this.$parent.view = Primary
            }
        }
    }
</script>