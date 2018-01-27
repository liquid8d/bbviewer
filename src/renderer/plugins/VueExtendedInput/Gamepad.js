import Vue from 'vue'

const Gamepad = new Vue({
    data () {
        return {
            config: {
                enabled: true,
                keyRepeat: 200,
                up: ['up'],
                right: ['right'],
                down: ['down'],
                left: ['left'],
                select: ['button1'],
                back: ['button2'],
                home: ['button3']
            },
            state: {
                available: false,
                gamepads: [],
                monitorLoop: undefined,
                last: {
                    pad: -1,
                    key: undefined,
                    time: 0
                }
            }
        }
    },
    created () {
        this.setEnabled(this.$data.config.enabled)
    },
    methods: {
        setEnabled (enabled) {
            if (enabled) {
                window.addEventListener('gamepadconnected', this.onGamepadConnected)
                window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected)
                console.log('Gamepad input ready')
            } else {
                window.removeEventListener('gamepadconnected', this.onGamepadConnected)
                window.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected)
                this.$data.state.loop = null
                cancelAnimationFrame(this.gamepadMonitor)
                console.log('Gamepad input disabled')
            }
        },
        onGamepadConnected (e) {
            this.gamepadEventHandler(e, true)
        },
        onGamepadDisconnected (e) {
            this.gamepadEventHandler(e, false)
        },
        gamepadEventHandler (e, connecting) {
            var gamepad = event.gamepad
            if (connecting) {
                this.$data.state.available = true
                this.$data.state.gamepads[gamepad.index] = gamepad
                console.log('Gamepad connected at index %d: %s. %d buttons, %d axis\'',
                    e.gamepad.index,
                    e.gamepad.id,
                    e.gamepad.buttons.length,
                    e.gamepad.axes.length)
                this.$data.state.monitorLoop = requestAnimationFrame(this.gamepadMonitor)
            } else {
                console.log('Gamepad disconnected from index %d: %s', e.gamepad.index, e.gamepad.id)
                delete this.$data.state.gamepads[gamepad.index]
                if (this.$data.state.gamepads.length === 0) {
                    this.$data.state.available = false
                    cancelAnimationFrame(this.$data.state.monitorLoop)
                }
            }
        },
        gamepadMonitor (e) {
            // console.log('monitor gamepads: ' + this.$data.state.available)
            if (!this.$data.state.available) return
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [])
            for (var i = 0; i < gamepads.length; i++) {
                if (gamepads[i]) {
                    var pressed = {
                        up: gamepads[i].axes[1].toFixed(4) < -0.5,
                        right: gamepads[i].axes[0].toFixed(4) > 0.5,
                        down: gamepads[i].axes[1].toFixed(4) > 0.5,
                        left: gamepads[i].axes[0].toFixed(4) < -0.5,
                        select: this.buttonPressed(gamepads[i].buttons[0]),
                        back: this.buttonPressed(gamepads[i].buttons[1]),
                        home: this.buttonPressed(gamepads[i].buttons[2])
                    }
                    if (this.$data.state.last.pad !== i || (this.$data.state.last.pad === i && Date.now() - this.$data.state.last.time > this.$data.config.keyRepeat)) {
                        var any = false
                        Object.keys(pressed).forEach((key) => {
                            if (pressed[key]) {
                                any = true
                                this.$data.state.last.key = key
                                this.$emit('key', key)
                            }
                        })
                        if (any) {
                            this.$data.state.last.pad = i
                            this.$data.state.last.time = Date.now()
                        }
                    }
                }
            }
            requestAnimationFrame(this.gamepadMonitor)
        },
        buttonPressed (b) {
            if (typeof (b) === 'object') return b.pressed
            return b === 1.0
        }
    }
})

export default Gamepad
