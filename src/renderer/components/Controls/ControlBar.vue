<template>
    <div class="controls">
        <component v-bind:is="view"></component>
    </div>
</template>

<script>
    import Primary from './Primary'
    import router from '../../router'
    export default {
        name: 'controlBar',
        router,
        data () {
            return {
                view: Primary
            }
        },
        methods: {
            beforeRouteUpdate (to, from, next) {
                console.log('router to ' + to + ' from ' + from)
            }
        }
    }
</script>

<style scoped>
/* CONTROLS */
.controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2.75em;
    background-color: #111;
    padding: 0.25em;
}
</style>