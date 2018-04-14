<template>
    <div class="page">
        <div class="container stretch shrink">
            <vue-menu ref="appMenu" class="app-menu"></vue-menu>
        </div>
        <div class="container" style="padding: 0;">
            <control-bar ref="controlBar"></control-bar>
        </div>
    </div>
</template>

<i18n>
{
    "en": {
        "left": "Left",
        "center": "Center",
        "right": "Right"
    }
}
</i18n>

<script>
    import Utils from '@/mixins/Utils'
    import ControlBar from './Controls/ControlBar'
    import Menu from './Menu'
    import router from '../router'

    const { PlayerEvents } = require('./Player/PlayerEvents')

    export default {
        name: 'home',
        components: { ControlBar, 'vue-menu': Menu },
        mixins: [ Utils ],
        data () {
            return {
                menu: '',
                anglesMenuItems: [
                    { id: 1, label: '' }
                ],
                audioMenuItems: [
                    { id: 1, label: this.$i18n.t('left'), click () { PlayerEvents.$emit('setAudioPan', 'left') } },
                    { id: 2, label: this.$i18n.t('center'), click () { PlayerEvents.$emit('setAudioPan', 'center') } },
                    { id: 3, label: this.$i18n.t('right'), click () { PlayerEvents.$emit('setAudioPan', 'right') } }
                ],
                playbackMenuItems: [
                    { id: 1, label: '0.75', click () { PlayerEvents.$emit('playbackRate', 0.75) } },
                    { id: 2, label: '1.0', click () { PlayerEvents.$emit('playbackRate', 1) } },
                    { id: 3, label: '1.25', click () { PlayerEvents.$emit('playbackRate', 1.25) } },
                    { id: 4, label: '1.5', click () { PlayerEvents.$emit('playbackRate', 1.5) } },
                    { id: 5, label: '2.0', click () { PlayerEvents.$emit('playbackRate', 2) } }
                ],
                qualityMenuItems: [
                    { id: -1, label: 'Auto' }
                ],
                defaultMenuItems: [
                    { id: 'volume', icon: 'static/controls/ic_volume_up_white_48px.svg', label: 'Volume', content: 'volume' },
                    { id: 'resize', icon: 'static/controls/ic_settings_overscan_white_48px.svg', label: 'Resize', content: 'resize' },
                    { id: 'newwin', icon: 'static/controls/ic_open_in_new_white_48px.svg', label: 'New Window', click () { this.createNewWindow() } },
                    { id: 'notifications', icon: 'static/controls/ic_new_releases_white_48px.svg', label: 'Notifications', click () { router.replace('notifications') } },
                    { id: 'donate', icon: 'static/controls/ic_monetization_on_white_48px.svg', label: 'Donate', click () { router.replace('donate') } },
                    { id: 'settings', icon: 'static/controls/ic_settings_white_48px.svg', label: 'Settings', click () { router.replace('settings') } },
                    { id: 'about', icon: 'static/controls/ic_info_white_48px.svg', label: 'About', click () { router.replace('about') } }
                ]
            }
        },
        mounted () {
            this.preventDraggables()
            PlayerEvents.$on('toggleAngle', this.toggleAngle)
            PlayerEvents.$on('toggleAudioPan', this.toggleAudioPan)
            PlayerEvents.$on('toggleSpeed', this.toggleSpeed)
            PlayerEvents.$on('toggleQuality', this.toggleQuality)
            PlayerEvents.$on('toggleMenu', this.toggleDefault)
            PlayerEvents.$on('provideAngles', this.onAngles)
            PlayerEvents.$on('provideLevels', this.onLevels)
        },
        beforeDestroy () {
            PlayerEvents.$off('toggleAngle', this.showAngles)
            PlayerEvents.$off('toggleAudioPan', this.toggleAudioPan)
            PlayerEvents.$off('toggleSpeed', this.toggleSpeed)
            PlayerEvents.$off('toggleQuality', this.toggleQuality)
            PlayerEvents.$off('toggleMenu', this.toggleMenu)
            PlayerEvents.$off('provideAngles', this.onAngles)
            PlayerEvents.$off('provideLevels', this.onLevels)
            this.toggleMenu()
        },
        methods: {
            onAngles (angles) {
                this.anglesMenuItems = angles
            },
            onLevels (list) {
                this.qualityMenuItems = list
            },
            toggleMenu (which) {
                if (this.$refs.appMenu) {
                    if (this.$refs.appMenu.$el.style.display === 'block') {
                        if (which === undefined || this.currentMenu === which) this.$refs.appMenu.$el.style.display = 'none'
                    } else {
                        this.$refs.appMenu.$el.style.display = 'block'
                    }
                    if (this.currentMenu !== which) {
                        this.currentMenu = which
                        return true
                    } else {
                        return false
                    }
                }
            },
            toggleAngle () {
                if (this.toggleMenu('angles')) {
                    if (this.$refs.appMenu) {
                        this.$refs.appMenu.items = this.anglesMenuItems
                        PlayerEvents.$emit('requestAngles')
                    }
                }
            },
            toggleAudioPan () {
                if (this.toggleMenu('audiopan')) {
                    if (this.$refs.appMenu) this.$refs.appMenu.items = this.audioMenuItems
                }
            },
            toggleDefault () {
                if (this.toggleMenu('main')) {
                    if (this.$refs.appMenu) {
                        this.$refs.appMenu.items = this.defaultMenuItems
                    }
                }
            },
            toggleSpeed () {
                if (this.toggleMenu('speed')) {
                    if (this.$refs.appMenu) this.$refs.appMenu.items = this.playbackMenuItems
                }
            },
            toggleQuality () {
                if (this.toggleMenu('quality')) {
                    if (this.$refs.appMenu) this.$refs.appMenu.items = this.qualityMenuItems
                }
            }
        }
    }
</script>

<style scoped>
    .app-menu {
        display: none;
        position: absolute;
        right: 1em;
        bottom: 7.25em;
        min-width: 8em;
        max-height: 50%;
        border-left: 0.05em solid #1d1d1d;
    }
    .audioPan {
        position: absolute;
        top: 0;
        bottom: 0;
    }
    .overlay {
        position: relative;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
</style>