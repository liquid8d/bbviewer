<template>
    <div class="wrapper">
        <div class="container">
            <h1>{{ $t('dev') }}</h1>
            <button @click.stop.prevent="fullscreen()">Fullscreen</button>
            <button @click="dir = chooseFolder()">{{dir}}</button>
            <button @click="screenshot()">Screenshot</button>
            <button @click="createNewWindow()">New</button>
            <button @click="resizeWindow(640,360)">Resize</button>
            <button @click="setWindowTitle('Test')">Set Title</button>
            <button @click="restartApp()">Restart</button>
            <button @click="setWindowOnTop()">Toggle OnTop</button>
        </div>
        <div class="container" style="flex-grow: 0;">
            <router-link to="/" tag="button">{{ $t('back') }}</router-link>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "dev": "Dev Testing"
    }
}
</i18n>

<script>
    import Utils from '@/mixins/Utils'
    export default {
        name: 'dev',
        data () {
            return {
                dir: 'Folder'
            }
        },
        mounted () {
            this.preventDraggables()
        },
        mixins: [ Utils ]
    }
</script>

<style>
    button {
        padding: 0.5em;
        margin: 0.5em;
        width: 8em;
    }
</style>