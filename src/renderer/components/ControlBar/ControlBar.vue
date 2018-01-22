<template>
    <div class="controls">
        <component v-bind:is="view"></component>
    </div>
</template>

<script>
    import Primary from './Primary'
    export default {
        name: 'controlBar',
        data () {
            return {
                view: Primary
            }
        }
    }
</script>

<style scoped>
.controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #333;
    padding: 0.25em;
}
button {
    height: 3.25em;
    width: 4.25em;
}
</style>