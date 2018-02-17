/**
 * A mixin that wraps up videojs control.
 * This mixin can be added to the Player component to use and control videojs
 */

import AudioPan from './AudioPan'

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
            player: null,
            settings: {
                liveWindow: 40
            },
            tech: null,
            streamInfo: {
                volume: 0,
                currentTime: 0,
                currentHHMMSS: '',
                durationHHMMSS: '',
                duration: 0,
                position: 0,
                qualities: [],
                isLiveStream: false
            }
        }
    },
    mounted () {
        if (this.player == null) {
            this.player = window.videojs(this.$el.querySelector('video'), {
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
            //     // 'loadedmetadata', 'loadeddata', , 'ratechange',
            //     // 'resize', 'texttrackchange',
            //     // tech events
            //     // 'loadstart', 'waiting', 'canplay', 'canplaythrough', 'playing',
            //     // 'ended', 'seeking', 'seeked', 'play', 'firstplay', 'pause',
            //     // 'durationchange', 'fullscreenchange', 'error', 'loadedmetadata',
            //     // 'posterchange', 'textdata',
            //     // tech listeners
            //     // 'mousedown', 'touchstart', 'touchmove', 'touchend', 'tap'
            //     // misc
            //     // 'pause', 'enterFullWindow', 'exitFullWindow', 'controlsenabled', 'controlsdisabled',
            //     // 'usingnativecontrols', 'usingcustomcontrols', 'useractive', 'userinactive', 'dispose'
            // ]

            // expose vjs events
            var vjsEvents = [ 'loadstart', 'timeupdate', 'volumechange' ]
            for (var i = 0; i < vjsEvents.length; i++) {
                this.player.on(vjsEvents[i], this.redirectPlayerEvent)
            }

            // handle incoming events
            PlayerEvents.$on('aspectRatio', this.aspectRatio)
            PlayerEvents.$on('play', this.play)
            PlayerEvents.$on('pause', this.pause)
            PlayerEvents.$on('stop', this.stop)
            PlayerEvents.$on('seek', this.seek)
            PlayerEvents.$on('seekTo', this.seekTo)
            PlayerEvents.$on('seekNormalize', this.seekNormalize)
            PlayerEvents.$on('playbackRate', this.playbackRate)

            PlayerEvents.$on('setQualityIndex', this.setQualityIndex)
            PlayerEvents.$on('goLive', this.goLive)

            PlayerEvents.$on('volume', this.volume)
            PlayerEvents.$on('toggleMute', this.toggleMute)
            PlayerEvents.$on('setAudioPan', this.setAudioPan)

            PlayerEvents.$on('pip', this.togglePip)

            console.log('video component ready.')
        }
    },
    methods: {
        aspectRatio (ratio) {
            this.player.aspectRatio(ratio)
        },
        currentTime () {
            return this.player.currentTime()
        },
        duration () {
            var time = this.player.seekable()
            if (time && time.length) {
                // set updated duration
                this.player.duration(this.player.seekable().end(0))
            }
            return this.player.duration()
        },
        dvrWindow () {
            if (this.player.seekable() && this.player.seekable().length) {
                return this.player.seekable().end(0) - this.player.seekable().start(0)
            }
            return this.player.duration()
        },
        isPlayingLive () {
            return this.duration() - this.currentTime() < this.settings.liveWindow
        },
        isLiveStream () {
            return this.streamInfo.isLiveStream || false
        },
        goLive () {
            if (this.player.seekable()) {
                this.player.currentTime(this.player.seekable().end(0))
            } else {
                this.seekTo(this.player.duration())
            }
        },
        pause () {
            if (this.paused()) {
                this.player.play()
            } else {
                this.player.pause()
                this.$emit('pause')
            }
        },
        paused () {
            return this.player.paused()
        },
        playing () {
            return this.player.playing
        },
        playbackRate (rate) {
            this.player.playbackRate(rate)
        },
        play (src) {
            if (src.indexOf('.m3u8') >= 0) {
                // HLS
                this.player.src({ src: src, type: 'application/x-mpegURL' })
            } else if (src.indexOf('.mp4') >= 0) {
                // MP4
                this.player.src({ src: src, type: 'video/mp4' })
            } else if (src.indexOf('.webm') >= 0) {
                this.player.src({ src: src, type: 'video/webm' })
            } else if (src.indexOf('.ism') >= 0) {
                // MSS
                this.player.src({ src: src, type: 'application/ttml+xml+mp4' })
            } else if (src.indexOf('.mpd') >= 0 || (src.indexOf('.ism') >= 0 && src.indexOf('format=mpd') >= 0)) {
                // DASH
                this.player.src({ src: src, type: 'application/dash+xml' })
            } else if (src.indexOf('youtube.com') >= 0) {
                // YOUTUBE
                this.player.src({ src: src, type: 'video/youtube' })
            } else if (src.indexOf('vimeo.com') >= 0) {
                // VIMEO
                this.player.src({ src: src, type: 'video/vimeo' })
            } else if (src.indexOf('rtmp://') >= 0) {
                // RTMP
                this.player.src({ src: src, type: 'rtmp/mp4' })
            } else if (src.indexOf('.f4m') >= 0) {
                // HDS
                this.player.src({ src: src, type: 'application/f4m' })
            } else {
                console.warn('unsupported video source')
            }
            this.player.play()
        },
        redirectPlayerEvent (event) {
            if (event.type === 'loadstart') {
                // hook player tech for audio pan
                this.tech = this.player.tech({ IWillNotUseThisInPlugins: true })
                AudioPan.init()
                AudioPan.connect(this.tech.el())
            } else if (event.type === 'timeupdate') {
                this.streamInfo.currentTime = (this.currentTime() !== undefined) ? this.currentTime() : -1
                this.streamInfo.duration = (this.duration() !== undefined) ? this.duration() : -1
                this.streamInfo.currentHHMMSS = (this.streamInfo.currentTime !== -1) ? this.toHHMMSS(this.streamInfo.currentTime) : ''
                this.streamInfo.durationHHMMSS = (this.streamInfo.duration !== -1) ? this.toHHMMSS(this.streamInfo.duration) : ''
                this.streamInfo.position = (this.streamInfo.currentTime !== -1 && this.streamInfo.duration !== -1) ? this.streamInfo.currentTime / this.streamInfo.duration : 0
            } else if (event.type === 'volumechange') {
                this.streamInfo.volume = this.player.volume()
            }
            PlayerEvents.$emit('streamInfo', this.streamInfo)
        },
        remainingTime () {
            return this.player.remainingTime()
        },
        seek (secs) {
            if (this.player.duration() <= 0) return
            if (this.player.currentTime() + secs < this.player.duration()) {
                this.player.currentTime(this.player.currentTime() + secs)
                this.$emit('seek')
            }
        },
        seekTo (secs) {
            if (secs < this.player.duration()) {
                this.player.currentTime(secs)
                this.$emit('seekTo')
            }
        },
        seekNormalize (normalize) {
            this.seekTo(this.player.duration() * normalize)
        },
        seeking () {
            return this.player.seeking()
        },
        setAudioPan (which) {
            AudioPan.pan(which)
        },
        setQualityIndex (idx) {
            console.log('no quality index implementation yet')
        },
        setMuted (muted) {
            this.player.muted(muted)
            PlayerEvents.$emit('muted', muted)
        },
        toggleMute () {
            this.setMuted(!this.player.muted())
        },
        volume (val) {
            if (val) this.player.volume(val)
            return this.player.volume()
        },
        stop () {
            if (!this.paused()) this.player.pause()
            this.player.reset()
            this.streamInfo = {
                volume: 0,
                currentTime: 0,
                currentHHMMSS: '',
                durationHHMMSS: '',
                duration: 0,
                position: 0,
                qualities: [],
                isLiveStream: false
            }
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
