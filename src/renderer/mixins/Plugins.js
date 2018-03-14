// import Vue from 'vue'
import store from '../store'

const { PlayerEvents } = require('../components/Player/PlayerEvents')

class BasePlugin {
    constructor (data) {
        if (!data.id || !data.label) {
            console.error('plugin must contain an id and label')
        } else {
            if (!data.created) data.created = this.created
            Object.assign(this, data)
            store.commit('addPlugin', this)
            this.created()
        }
    }

    created () {
        console.log('registered plugin: ' + this.id)
    }
}

class VideoPlugin extends BasePlugin {
    constructor (data) {
        super(data)
        if (!data.init) data.init = this.init
        if (!data.getSelectedAngle) data.getSelectedAngle = this.getSelectedAngle
        if (!data.loadBookmark) data.loadBookmark = this.loadBookmark
        if (!data.onLoadedMetadata) data.onLoadedMetadata = this.onLoadedMetadata
        if (!data.onRequestBookmarks) data.onRequestBookmarks = this.onRequestBookmarks
        if (!data.onRequestAngles) data.onRequestAngles = this.onRequestAngles
        if (!data.onStop) data.onStop = this.onStop
        if (!data.onUpdate) data.onUpdate = this.onUpdate
    }

    init () {
        console.log('initialize plugin: ' + this.id)
    }

    getSelectedAngle () {
        console.warn('no selected angle specified')
    }

    switchAngle (angle) {
        console.warn('cannot switch angle')
    }

    loadBookmark (bookmark) {
        console.warn('cannot load bookmark')
    }

    onLoadedMetadata () {
        console.log('onLoadedMetadata')
    }

    onRequestBookmarks () {
        console.warn('no bookmarks available')
        PlayerEvents.$emit('provideBookmarks', [])
    }

    onRequestAngles () {
        console.warn('no angles available')
    }

    onStop () {
        console.warn('stop plugin')
    }

    onUpdate (data) {
        PlayerEvents.$emit('videotext', data.currentHHMMSS + ' / ' + data.durationHHMMSS)
    }
}
export default VideoPlugin
