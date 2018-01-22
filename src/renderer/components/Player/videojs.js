/**
 * A mixin that wraps up videojs control.
 * This mixin can be added to the Player component to use and control videojs
 */

// import PlayerEvents from './PlayerEvents'

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
            streamInfo: {
                currentTime: 0,
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

            // // expose vjs and player events
            // for (var i = 0; i < vjsEvents.length; i++) {
            //     PlayerEvents.$emit(vjsEvents[i])
            // }
            // var exposed = [ 'play', 'pause', 'stop', 'playbackRate', 'mute', 'seek', 'seekTo' ]
            // for (var x = 0; x < exposed.length; x++) {
            //     PlayerEvents.$on(exposed[x], exposed[x])
            // }

            PlayerEvents.$on('aspectRatio', this.aspectRatio)
            PlayerEvents.$on('play', this.play)
            PlayerEvents.$on('pause', this.pause)
            PlayerEvents.$on('stop', this.stop)
            PlayerEvents.$on('seek', this.seek)
            PlayerEvents.$on('seekTo', this.seekTo)
            PlayerEvents.$on('playbackRate', this.playbackRate)

            PlayerEvents.$on('volume', this.volume)
            PlayerEvents.$on('setQualityIndex', this.setQualityIndex)
            PlayerEvents.$on('goLive', this.goLive)

            PlayerEvents.$on('muted', this.muted)
            PlayerEvents.$on('toggleMute', this.toggleMute)

            console.log('video component ready.')

            // update
            setInterval(() => {
                this.update()
            }, 500)
        }
    },
    methods: {
        update () {
            // this.streamInfo.currentTime = this.currentTime()
            // this.streamInfo.duration = this.duration()
        },
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
        muted (muted) {
            return this.player.muted(muted)
        },
        toggleMute () {
            this.muted(!this.player.muted())
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
        seeking () {
            return this.player.seeking()
        },
        setQualityIndex (idx) {
            console.log('no quality index implementation yet')
        },
        volume (val) {
            this.player.volume(val)
            return this.player.volume()
        },
        stop () {
            if (!this.paused()) this.player.pause()
            this.player.reset()
            this.streamInfo = { tech: null, qualities: [], isLiveStream: false }
        }
    }
}
