<template>
    <div class="page cover">
        <div class="container stretch">
            <dynamic-form :form="form"></dynamic-form>
        </div>
        <div class="container">
            <button class="icon" @mousedown.stop @click="$router.replace('/')" v-bind:title="$t('back')"><img src="static/controls/ic_chevron_left_white_48px.svg" /><span>{{$t('back')}}</span></button>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "account": "Accounts",
        "auth": "Authenticate",
        "back": "Back",
        "display": "Display",
        "display.desc": "Display options",
        "display.dragWindow": "Drag Window",
        "display.dragWindow.desc": "Click-and-drag for window movement",
        "display.hideLeave": "Hide Leave",
        "display.hideLeave.desc": "Hide window title and controls when the mouse leaves the window",
        "display.hideDelay": "Hide Delay",
        "display.hideDelay.desc": "Hide window title and controls after a set delay",
        "display.hideTimeout": "Hide Timeout",
        "display.hideTimeout.desc": "The delay, in milliseconds, before window title and controls are hidden if hide delay is enabled",
        "misc": "Misc",
        "misc.desc": "Miscellaneous options",
        "misc.locale": "Locale",
        "misc.locale.desc": "Choose your locale/language",
        "misc.build": "Build",
        "misc.build.desc": "Choose the build to use",
        "misc.build.release": "Release",
        "misc.screenshotFolder": "Screenshot Folder",
        "misc.screenshotFolder.desc": "Choose a folder to store screenshots",
        "misc.flash": "Flash Check",
        "misc.flash.desc": "Check if Flash is installed",
        "dev": "Development",
        "dev.desc": "Development options",
        "dev.debug": "Video Debugging",
        "dev.debug.desc": "Shows debug information when video is playing",
        "dev.testing": "Dev Testing",
        "dev.testing.desc": "Testing area for development",
        "restart": "Restart App",
        "settings": "Settings"
    }
}
</i18n>

<script>
    import Utils from '@/mixins/Utils'
    import DynamicForm from './DynamicForm'
    import router from '../router'

    export default {
        name: 'settings',
        components: { 'dynamic-form': DynamicForm },
        mixins: [ Utils ],
        data () {
            return {
                dir: '',
                showFlash: false,
                form: {
                    items: [
                        {
                            id: 'display',
                            label: this.$t('display'),
                            desc: this.$t('display.desc'),
                            items: [
                                { id: 'dragWindow', type: 'checkbox', label: this.$t('display.dragWindow'), desc: this.$t('display.dragWindow.desc') },
                                { id: 'hideLeave', type: 'checkbox', label: this.$t('display.hideLeave'), desc: this.$t('display.hideLeave.desc') },
                                { id: 'hideDelay', type: 'checkbox', label: this.$t('display.hideDelay'), desc: this.$t('display.hideDelay.desc') },
                                { id: 'hideTimeout', type: 'number', label: this.$t('display.hideTimeout'), desc: this.$t('display.hideTimeout.desc') }
                            ]
                        },
                        {
                            id: 'misc',
                            label: this.$t('misc'),
                            desc: this.$t('misc.desc'),
                            items: [
                                { id: 'locale', type: 'locale', label: this.$t('misc.locale'), desc: this.$t('misc.locale.desc') },
                                { id: 'build', type: 'select', label: this.$t('misc.build'), desc: this.$t('misc.build.desc'), options: [ { id: 'release', label: this.$t('misc.build.release') } ] },
                                { id: 'screenshotFolder', type: 'folder', label: this.$t('misc.screenshotFolder'), desc: this.$t('misc.screenshotFolder.desc') },
                                { id: 'flashcheck', type: 'button', label: this.$t('misc.flash'), desc: this.$t('misc.flash.desc'), onclick () { router.push('/flashcheck') } }
                            ]
                        },
                        {
                            id: 'dev',
                            label: this.$t('dev'),
                            desc: this.$t('dev.desc'),
                            items: [
                                { id: 'debug', type: 'checkbox', label: this.$t('dev.debug'), desc: this.$t('dev.debug.desc'), onclick () { document.getElementById('debug').style.display = (document.getElementById('debug').style.display === 'block') ? 'none' : 'block' } },
                                { id: 'dev', type: 'button', label: this.$t('dev.testing'), desc: this.$t('dev.testing.desc'), onclick () { router.push('/dev') } }
                            ]
                        }
                    ]
                }
            }
        },
        mounted () {
            this.preventDraggables()
            this.$extendedInput.selectEl()
        }
    }
</script>

<style scoped>
    a {
        margin-right: 1em;
    }
    .pad {
        margin: 0 2em 0 2em;
    }
    .flash {
        max-height: 3em;
    }
</style>