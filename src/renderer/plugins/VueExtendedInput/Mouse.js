import Vue from 'vue'
const path = require('path')
require('@/assets/cursor.png')

const Mouse = new Vue('mouse', {
    name: 'mouse',
    data () {
        return {
            config: {
                enabled: false,
                cursor: path.join(__dirname, '/cursor.png').replace(/\\/g, '\\\\'),
                cursorEl: 'ui-cursor'
            }
        }
    },
    mounted () {
        // console.log('mounted cursor!')
        this.setCursor(this.$data.config.enabled)
        if (this.$data.config.enabled) {
            document.addEventListener('mousemove', this.onMouseMove, false)
            // this.$on('mouse', (event) => {
            //     if (event === 'disable') this.hideMouse()
            // })
            console.log('Mouse input ready')
        } else {
            console.log('Mouse input is disabled')
        }
    },
    methods: {
        render (createElement) {
            return createElement('div', {
                attrs: {
                    id: 'ui-cursor'
                },
                style: {
                    display: 'none',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '24px',
                    height: '24px',
                    background: 'url("' + this.$data.config.cursor + '")',
                    zIndex: 999
                }
            }, '')
        },
        showMouse () {
            this.$el.style.display = ''
        },
        hideMouse () {
            this.$el.style.display = 'none'
        },
        setCursor (enabled) {
            // var cursor = document.getElementById(this.$data.config.cursorEl)
            if (enabled) this.showMouse(); else this.hideMouse()
        },
        onMouseMove (e) {
            if (e.movementX === 0 && e.movementY === 0) return // scrollbars appearing 'moves' mouse
            if (e.movementX === e.screenX && e.movementY === e.screenY) return // fullscreen 'moves' mouse
            if (this.$data.config.enabled) {
                this.$el.style.left = e.clientX + 'px'
                this.$el.style.top = e.clientY + 'px'
            }
            this.$emit('input', 'mouse')
        }
    }
})

export default Mouse
