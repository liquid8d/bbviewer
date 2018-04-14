/**
 * A mixin that wraps up videojs control.
 * This mixin can be added to the Player component to use and control videojs
 */

import AudioPan from './AudioPan'
import Utils from '../../mixins/Utils'

require('videojs-contrib-media-sources')
require('videojs-contrib-hls.js')
require('dashjs/dist/dash.all.min.js')
require('videojs-contrib-dash/dist/videojs-dash.min.js')
require('videojs-youtube/dist/Youtube.min.js')
require('videojs-flash/dist/videojs-flash.js')
require('./../../../js/videojs-vimeo.min.js')
// #if process.env.BUILD_TARGET != 'web'
require('videojs-swf/dist/video-js.swf')
// #endif
const { PlayerEvents } = require('./PlayerEvents')

export default {
    data () {
        return {
            handler: null,
            settings: {
                liveWindow: 40
            },
            tech: null,
            streamInfo: {
                url: '',
                volume: 0,
                currentTime: 0,
                currentHHMMSS: '',
                durationHHMMSS: '',
                duration: 0,
                position: 0,
                qualities: [],
                isLiveStream: false,
                isPlayingLive: false
            }
        }
    },
    mixins: [ Utils ],
    mounted () {
        // listen to swf events for dev
        window.swfPlayer = function (data) {
            // console.log('got sfw data')
            // console.dir(data)
        }

        if (this.$globals.player == null) {
            this.$globals.player = window.videojs(this.$el.querySelector('video'), {
                techOrder: ['html5', 'youtube', 'vimeo', 'flash'],
                html5: {
                    hlsjsConfig: {
                        debug: false
                    }
                },
                // #if process.env.BUILD_TARGET != 'web'
                flash: {
                    swf: '../node_modules/videojs-swf/dist/video-js.swf'
                },
                // #endif
                autoplay: true,
                controls: false,
                loop: false,
                children: ['video', 'mediaLoader']
            })
            // // redirect player events to our Vue component
            // var vjsEvents = [
            //     'volumechange', 'timeupdate'
            //     // 'progress', 'abort', 'suspend', 'emptied', 'stalled',
            //     // 'loadeddata', , 'ratechange',
            //     // 'resize', 'texttrackchange',
            //     // tech events
            //     // 'loadstart', 'waiting', 'canplay', 'canplaythrough', 'playing',
            //     // 'ended', 'seeking', 'seeked', 'play', 'firstplay', 'pause',
            //     // 'durationchange', 'fullscreenchange', 'error'
            //     // 'posterchange', 'textdata',
            //     // tech listeners
            //     // 'mousedown', 'touchstart', 'touchmove', 'touchend', 'tap'
            //     // misc
            //     // 'pause', 'enterFullWindow', 'exitFullWindow', 'controlsenabled', 'controlsdisabled',
            //     // 'usingnativecontrols', 'usingcustomcontrols', 'useractive', 'userinactive', 'dispose'
            // ]

            // expose vjs events
            var vjsEvents = [ 'play', 'pause', 'loadstart', 'loadedmetadata', 'timeupdate', 'volumechange' ]
            for (var i = 0; i < vjsEvents.length; i++) {
                this.$globals.player.on(vjsEvents[i], this.redirectPlayerEvent)
            }

            // handle incoming events
            PlayerEvents.$on('setHandler', this.setHandler)
            PlayerEvents.$on('aspectRatio', this.aspectRatio)
            PlayerEvents.$on('play', this.play)
            PlayerEvents.$on('playItem', this.playItem)
            PlayerEvents.$on('playSWF', this.playSWF)
            PlayerEvents.$on('pause', this.pause)
            PlayerEvents.$on('stop', this.stop)
            PlayerEvents.$on('seek', this.seek)
            PlayerEvents.$on('seekTo', this.seekTo)
            PlayerEvents.$on('seekNormalize', this.seekNormalize)
            PlayerEvents.$on('playbackRate', this.playbackRate)
            PlayerEvents.$on('switchlevel', this.switchLevel)
            PlayerEvents.$on('goLive', this.goLive)
            PlayerEvents.$on('volume', this.volume)
            PlayerEvents.$on('toggleMute', this.toggleMute)
            PlayerEvents.$on('setAudioPan', this.setAudioPan)
            PlayerEvents.$on('pip', this.togglePip)
            PlayerEvents.$on('requestAngles', this.onRequestAngles)
            PlayerEvents.$on('requestBookmarks', this.requestBookmarks)
            PlayerEvents.$on('switchAngle', this.switchAngle)
            PlayerEvents.$on('loadBookmark', this.loadBookmark)

            console.log('video component ready.')
        }
    },
    beforeDestroy () {
        PlayerEvents.$off('setHandler', this.setHandler)
        PlayerEvents.$off('aspectRatio', this.aspectRatio)
        PlayerEvents.$off('play', this.play)
        PlayerEvents.$off('playItem', this.playItem)
        PlayerEvents.$off('playSWF', this.playSWF)
        PlayerEvents.$off('pause', this.pause)
        PlayerEvents.$off('stop', this.stop)
        PlayerEvents.$off('seek', this.seek)
        PlayerEvents.$off('seekTo', this.seekTo)
        PlayerEvents.$off('seekNormalize', this.seekNormalize)
        PlayerEvents.$off('playbackRate', this.playbackRate)
        PlayerEvents.$off('switchlevel', this.switchLevel)
        PlayerEvents.$off('goLive', this.goLive)
        PlayerEvents.$off('volume', this.volume)
        PlayerEvents.$off('toggleMute', this.toggleMute)
        PlayerEvents.$off('setAudioPan', this.setAudioPan)
        PlayerEvents.$off('pip', this.togglePip)
        PlayerEvents.$off('requestAngles', this.onRequestAngles)
        PlayerEvents.$off('requestBookmarks', this.requestBookmarks)
        PlayerEvents.$off('loadBookmark', this.loadBookmark)
        PlayerEvents.$off('switchAngle', this.switchAngle)
    },
    methods: {
        setSWF (swf) {
            this.$globals.player.options_.flash.swf = swf
        },
        setHandler (handler) {
            console.log('set player handler to: ' + handler.id)
            this.handler = handler
        },
        loadBookmark (bookmark) {
            if (this.handler && this.handler.loadBookmark) this.handler.loadBookmark(bookmark)
        },
        requestBookmarks () {
            if (this.handler && this.handler.onRequestBookmarks) this.handler.onRequestBookmarks()
        },
        onRequestAngles () {
            if (this.handler && this.handler.onRequestAngles) this.handler.onRequestAngles()
        },
        getSelectedAngle () {
            if (this.handler && this.handler.getSelectedAngle) {
                return this.handler.getSelectedAngle()
            } else {
                return 1
            }
        },
        switchAngle (angle) {
            if (this.handler && this.handler.switchAngle) {
                this.handler.switchAngle(angle)
                PlayerEvents.$emit('anglechange', angle)
            }
        },
        aspectRatio (ratio) {
            // keep (fit), crop (fill), off (stretch)
            this.$globals.player.aspectRatio(ratio)
        },
        currentTime () {
            return this.$globals.player.currentTime()
        },
        duration () {
            var time = this.$globals.player.seekable()
            if (time && time.length) {
                // set updated duration
                this.$globals.player.duration(this.$globals.player.seekable().end(0))
            }
            return this.$globals.player.duration()
        },
        dvrWindow () {
            if (this.$globals.player.seekable() && this.$globals.player.seekable().length) {
                return this.$globals.player.seekable().end(0) - this.$globals.player.seekable().start(0)
            }
            return this.$globals.player.duration()
        },
        isPlayingLive () {
            if (this.handler && this.handler.isPlayingLive) {
                return this.handler.isPlayingLive()
            }
            return this.duration() - this.currentTime() < this.settings.liveWindow
        },
        isLiveStream () {
            if (this.handler && this.handler.isLiveStream) {
                return this.handler.isLiveStream()
            } else if (this.tech.sourceHandler_ && this.tech.sourceHandler_.hls) {
                return this.tech.sourceHandler_.hls.liveSyncPosition !== undefined
            }
            return false
        },
        goLive () {
            if (this.$globals.player.seekable()) {
                // console.log('seekable to end')
                this.$globals.player.currentTime(this.$globals.player.seekable().end(0))
            } else {
                // console.log('seek to end')
                this.seekTo(this.$globals.player.duration())
            }
        },
        pause () {
            if (this.paused()) {
                this.$globals.player.play()
            } else {
                this.$globals.player.pause()
            }
        },
        paused () {
            return this.$globals.player.paused()
        },
        playing () {
            return this.$globals.player.playing
        },
        playbackRate (rate) {
            this.$globals.player.playbackRate(rate)
            PlayerEvents.$emit('playbackratechange', rate)
        },
        playSWF (item) {
            if (!item.swf) return
            // set swf
            this.setSWF(item.swf)
            this.play(item.src)
        },
        playItem (item) {
            // load source handler, if provided
            if (item.src instanceof Object) {
                let plugin = this.getPlugin(item.src.handler)
                if (plugin) {
                    if (this.$globals.player.currentSrc()) this.stop()
                    this.setHandler(plugin)
                    console.log('playing with handler: ' + this.handler.id)
                    if (this.handler.init) this.handler.init()
                    if (this.handler.play) this.handler.play(item.src); else if (item.src) this.play(item.src)
                } else {
                    console.error('plugin for requested handler does not exist')
                }
            } else {
                // play source url
                if (this.$globals.player.currentSrc()) this.stop()
                this.setHandler(this.getPlugin('default'))
                console.log('playing item src')
                this.play(item.src)
            }
        },
        play (src) {
            if (src.indexOf('.m3u8') >= 0) {
                // HLS
                this.$globals.player.src({ src: src, type: 'application/x-mpegURL', withCredentials: true })
            } else if (src.indexOf('.mp4') >= 0) {
                // MP4
                this.$globals.player.src({ src: src, type: 'video/mp4' })
            } else if (src.indexOf('.webm') >= 0) {
                this.$globals.player.src({ src: src, type: 'video/webm' })
            } else if (src.indexOf('.ism') >= 0) {
                // MSS
                this.$globals.player.src({ src: src, type: 'application/ttml+xml+mp4' })
            } else if (src.indexOf('.mpd') >= 0 || (src.indexOf('.ism') >= 0 && src.indexOf('format=mpd') >= 0)) {
                // DASH
                this.$globals.player.src({ src: src, type: 'application/dash+xml' })
            } else if (src.indexOf('youtube.com') >= 0) {
                // YOUTUBE
                this.$globals.player.src({ src: src, type: 'video/youtube' })
            } else if (src.indexOf('vimeo.com') >= 0) {
                // VIMEO
                this.$globals.player.src({ src: src, type: 'video/vimeo' })
            } else if (src.indexOf('rtmp://' >= 0)) {
                // RTMP or Custom SWF
                this.$globals.player.src({ src: src, type: 'rtmp/mp4' })
            } else if (src.indexOf('.f4m') >= 0) {
                // HDS
                this.$globals.player.src({ src: src, type: 'application/f4m' })
            } else if (this.$globals.player.options_.flash.swf) {
                this.$globals.player.src({ src: src })
            } else {
                console.warn('unsupported video source')
            }
            this.streamInfo.url = this.$globals.player.currentSrc() || ''
            this.$globals.player.play()
        },
        redirectPlayerEvent (event) {
            if (event.type === 'play') {
                PlayerEvents.$emit('onPlay')
            } else if (event.type === 'pause') {
                PlayerEvents.$emit('onPause')
            } else if (event.type === 'loadstart') {
                // hook player tech for audio pan
                this.tech = this.$globals.player.tech({ IWillNotUseThisInPlugins: true })
                // if (this.tech.sourceHandler_ && this.tech.sourceHandler_.hls) {
                //     this.tech = this.tech.sourceHandler_.hls
                // }
                AudioPan.init(this.tech.el())
            } else if (event.type === 'loadedmetadata') {
                console.log('loaded metadata')
                // console.dir(this.tech)
                // console.dir(this.$globals.player.qualityLevels())
                if (this.handler && this.handler.onLoadedMetadata) this.handler.onLoadedMetadata()

                // find quality levels
                if (this.tech.sourceHandler_ && this.tech.sourceHandler_.hls) {
                    // console.dir(this.tech.sourceHandler_.hls)
                    let qualities = []
                    for (var i = 0; i < this.tech.sourceHandler_.hls.levelController.levels.length; i++) {
                        let quality = this.tech.sourceHandler_.hls.levelController.levels[i]
                        qualities.unshift({
                            id: i,
                            label: quality.width + 'x' + quality.height + ' (' + this.convertBytes(quality.bitrate) + ')',
                            click: function () {
                                PlayerEvents.$emit('switchlevel', this)
                            }
                        })
                    }
                    qualities.unshift({
                        id: -1,
                        label: 'Auto',
                        click: function () {
                            PlayerEvents.$emit('switchlevel', this)
                        }
                    })
                    this.streamInfo.currentLevel = (this.tech.sourceHandler_.hls.manualLevel === -1) ? 0 : this.tech.sourceHandler_.hls.currentLevel
                    this.streamInfo.qualities = qualities
                    PlayerEvents.$emit('provideLevels', this.streamInfo.qualities)
                    this.switchLevel(this.getLevel())
                } else {
                    console.log('unknown tech')
                    this.streamInfo.isLiveStream = this.isLiveStream()
                }
            } else if (event.type === 'timeupdate') {
                this.streamInfo.currentTime = (this.currentTime() !== undefined) ? this.currentTime() : -1
                this.streamInfo.duration = (this.duration() !== undefined) ? this.duration() : -1
                this.streamInfo.currentHHMMSS = (this.streamInfo.currentTime !== -1) ? this.toHHMMSS(this.streamInfo.currentTime) : ''
                this.streamInfo.durationHHMMSS = (this.streamInfo.duration !== -1) ? this.toHHMMSS(this.streamInfo.duration) : ''
                this.streamInfo.position = (this.streamInfo.currentTime !== -1 && this.streamInfo.duration !== -1) ? this.streamInfo.currentTime / this.streamInfo.duration : 0
                this.streamInfo.isLiveStream = this.isLiveStream()

                // show some debug info
                if (document.getElementById('debug')) {
                    document.getElementById('debug').innerHTML = `
                    <p>url: ` + this.streamInfo.url + `</p>
                    <p>currentTime: ` + this.streamInfo.currentTime + `</p>
                    <p>duration: ` + this.streamInfo.duration + `</p>
                    <p>currentHHMMSS: ` + this.streamInfo.currentHHMMSS + `</p>
                    <p>durationHHMMSS: ` + this.streamInfo.durationHHMMSS + `</p>
                    <p>position: ` + this.streamInfo.position + `</p>
                    <p>isLiveStream: ` + this.streamInfo.isLiveStream + `</p>
                    <p>isPlayingLive: ` + this.streamInfo.isPlayingLive + `</p>
                    <p>qualities: ` + this.streamInfo.qualities.length + `</p>
                    `
                }
            } else if (event.type === 'volumechange') {
                this.streamInfo.volume = this.$globals.player.volume()
            }
            PlayerEvents.$emit('update', this.streamInfo)
            if (this.handler) this.handler.onUpdate(this.streamInfo)
        },
        convertBytes (b) {
            if (b < 1024) return b + 'B'
            if (b < 1024000) return Math.round(b / 1024) + 'KB'
            if (b < 1024000000) return Math.round(b / 1024000) + 'MB'
        },
        remainingTime () {
            return this.$globals.player.remainingTime()
        },
        seek (secs) {
            if (this.$globals.player.duration() <= 0) return
            if (this.$globals.player.currentTime() + secs < this.$globals.player.duration()) {
                this.$globals.player.currentTime(this.$globals.player.currentTime() + secs)
                this.$emit('seek')
            }
        },
        seekTo (secs) {
            if (secs < this.$globals.player.duration()) {
                this.$globals.player.currentTime(secs)
                this.$emit('seekTo')
            }
        },
        seekNormalize (normalize) {
            this.seekTo(this.$globals.player.duration() * normalize)
        },
        seeking () {
            return this.$globals.player.seeking()
        },
        setAudioPan (which) {
            AudioPan.pan(which)
        },
        getLevel () {
            for (var i = 0; i < this.streamInfo.qualities.length; i++) {
                if (this.streamInfo.qualities[i].id === this.streamInfo.currentLevel) return this.streamInfo.qualities[i]
            }
            return {}
        },
        switchLevel (item) {
            if (this.tech.sourceHandler_ && this.tech.sourceHandler_.hls) {
                PlayerEvents.$emit('levelchange', item)
                this.tech.sourceHandler_.hls.levelController.manualLevel = item.id
            }
        },
        setMuted (muted) {
            this.$globals.player.muted(muted)
            PlayerEvents.$emit('muted', muted)
        },
        stop () {
            this.$globals.player.reset()
            this.$globals.player.options_.flash.swf = '../node_modules/videojs-swf/dist/video-js.swf'
            this.streamInfo = {
                volume: 0,
                currentTime: 0,
                currentHHMMSS: '',
                durationHHMMSS: '',
                duration: 0,
                position: 0,
                qualities: [],
                isLiveStream: false,
                isPlayingLive: false
            }
            if (this.handler) this.handler.onStop()
            this.handler = null
            PlayerEvents.$emit('notlive')
            PlayerEvents.$emit('provideLevels', [])
            PlayerEvents.$emit('levelchange', '')
            PlayerEvents.$emit('videotext', '')
            this.setWindowTitle('BBViewer')
        },
        toggleMute () {
            this.setMuted(!this.$globals.player.muted())
        },
        volume (val) {
            if (val) this.$globals.player.volume(val)
            return this.$globals.player.volume()
        },
        toHHMMSS (sec) {
            var secs = parseInt(sec, 10)
            var hours = Math.floor(secs / 3600)
            var minutes = Math.floor((secs - (hours * 3600)) / 60)
            var seconds = secs - (hours * 3600) - (minutes * 60)

            if (hours < 10) hours = '0' + hours
            if (minutes < 10) minutes = '0' + minutes
            if (seconds < 10) seconds = '0' + seconds
            return hours + ':' + minutes + ':' + seconds
        },
        togglePip () {
            if (this.$el.classList.contains('pip')) {
                this.$el.classList.remove('pip')
            } else {
                this.$el.classList.add('pip')
            }
        }
    }
}
