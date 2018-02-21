import { PlayerEvents } from './PlayerEvents'

const AudioPan = {
    initialized: false,
    context: null,
    gainL: null,
    gainR: null,
    merger: null,
    splitter: null,
    oscillator: null,
    source: null,
    init (node) {
        if (this.initialized) return
        try {
            var AudioContext = window.AudioContext || window.webkitAudioContext
            this.context = new AudioContext()
            this.gainL = this.context.createGain()
            this.gainR = this.context.createGain()
            this.gainL.gain.value = 1
            this.gainR.gain.value = 1
            this.merger = this.context.createChannelMerger(2)
            this.splitter = this.context.createChannelSplitter(2)
            // this.oscillator = this.context.createOscillator()
            this.connect(node)
            this.initialized = true
            console.log('audio pan initialized')
        } catch (e) {
            console.log('couldnt get audiocontext: ' + e)
        }
    },
    connect (node, output, input) {
        try {
            this.source = this.context.createMediaElementSource(node)
            this.source.connect(this.splitter, 0, 0)
            this.splitter.connect(this.gainL, 0)
            this.splitter.connect(this.gainR, 1)
            // default to stereo
            this.panCenter()
            this.merger.connect(this.context.destination, 0, 0)
            console.log('connected to audio')
        } catch (e) {
            console.log('audiocontext couldnt connect to media element: ' + e)
        }
    },
    pan (which) {
        if (which === 'left') {
            this.panLeft()
        } else if (which === 'center') {
            this.panCenter()
        } else if (which === 'right') {
            this.panRight()
        }
    },
    panLeft () {
        if (!this.gainL || !this.gainR) return false
        this.gainR.disconnect()
        this.gainL.connect(this.merger, 0, 0)
        PlayerEvents.$emit('audiopanchange', 'left')
    },
    panRight () {
        if (!this.gainL || !this.gainR) return false
        this.gainL.disconnect()
        this.gainR.connect(this.merger, 0, 1)
        PlayerEvents.$emit('audiopanchange', 'right')
    },
    panCenter () {
        if (!this.gainL || !this.gainR) return false
        this.gainL.connect(this.merger, 0, 0)
        this.gainR.connect(this.merger, 0, 1)
        PlayerEvents.$emit('audiopanchange', 'center')
    }
}

export default AudioPan
