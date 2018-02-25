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
                anglesMenuItems: [
                    { id: 1, label: 'No Angles' }
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
                    { id: 1, label: 'Auto' }
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
            PlayerEvents.$on('showMenu', this.showMenu)
            PlayerEvents.$on('toggleAngle', this.showAngles)
            PlayerEvents.$on('toggleAudioPan', this.showAudioPan)
            PlayerEvents.$on('toggleSpeed', this.showSpeed)
            PlayerEvents.$on('toggleQuality', this.showQuality)
            PlayerEvents.$on('toggleMenu', this.showMenu)
            PlayerEvents.$on('provideAngles', this.onAngles)
        },
        beforeDestory () {
            PlayerEvents.$off('showMenu', this.showMenu)
            PlayerEvents.$off('toggleAngle', this.showAngles)
            PlayerEvents.$off('toggleAudioPan', this.showAudioPan)
            PlayerEvents.$off('toggleSpeed', this.showSpeed)
            PlayerEvents.$off('toggleQuality', this.showQuality)
            PlayerEvents.$off('toggleMenu', this.showMenu)
            PlayerEvents.$off('provideAngles', this.onAngles)
            this.hideMenu()
        },
        methods: {
            onAngles (angles) {
                this.anglesMenuItems = []
                for (var i = 0; i < angles.length; i++) {
                    let angle = {
                        id: i + 1,
                        label: angles[i].label,
                        click: function () {
                            PlayerEvents.$emit('switchAngle', this.id)
                        }
                    }
                    this.anglesMenuItems.push(angle)
                }
            },
            hideMenu () {
                if (this.$refs.appMenu) this.$refs.appMenu.$el.style.display = 'none'
            },
            showAngles () {
                if (this.$refs.appMenu) {
                    if (this.$refs.appMenu.items === this.anglesMenuItems && this.$refs.appMenu.$el.style.display !== 'none') {
                        this.$refs.appMenu.$el.style.display = 'none'
                    } else {
                        this.$refs.appMenu.$el.style.display = 'block'
                        this.$refs.appMenu.items = this.anglesMenuItems
                    }
                }
            },
            showAudioPan () {
                if (this.$refs.appMenu) {
                    if (this.$refs.appMenu.items === this.audioMenuItems && this.$refs.appMenu.$el.style.display !== 'none') {
                        this.$refs.appMenu.$el.style.display = 'none'
                    } else {
                        this.$refs.appMenu.$el.style.display = 'block'
                        this.$refs.appMenu.items = this.audioMenuItems
                    }
                }
            },
            showSpeed () {
                if (this.$refs.appMenu) {
                    if (this.$refs.appMenu.items === this.playbackMenuItems && this.$refs.appMenu.$el.style.display !== 'none') {
                        this.$refs.appMenu.$el.style.display = 'none'
                    } else {
                        this.$refs.appMenu.$el.style.display = 'block'
                        this.$refs.appMenu.items = this.playbackMenuItems
                    }
                }
            },
            showQuality () {
                if (this.$refs.appMenu) {
                    if (this.$refs.appMenu.items === this.qualityMenuItems && this.$refs.appMenu.$el.style.display !== 'none') {
                        this.$refs.appMenu.$el.style.display = 'none'
                    } else {
                        this.$refs.appMenu.$el.style.display = 'block'
                        this.$refs.appMenu.items = this.qualityMenuItems
                    }
                }
            },
            showMenu (toggle) {
                if (toggle === false) {
                    this.hideMenu()
                    return
                }
                if (this.$refs.appMenu) {
                    if (this.$refs.appMenu.items === this.defaultMenuItems && this.$refs.appMenu.$el.style.display !== 'none') {
                        this.$refs.appMenu.$el.style.display = 'none'
                    } else {
                        this.$refs.appMenu.$el.style.display = 'block'
                        this.$refs.appMenu.items = this.defaultMenuItems
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .app-menu {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 6.4em;
        min-width: 8em;
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