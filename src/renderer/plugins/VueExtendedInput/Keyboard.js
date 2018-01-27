// AS A VUE COMPONENT
import Vue from 'vue'

const Keyboard = new Vue({
    data () {
        return {
            config: {
                up: [38],
                down: [40],
                right: [39],
                left: [37],
                select: [13],
                back: [8],
                home: [27]
            }
        }
    },
    created () {
        document.addEventListener('keydown', this.keyboardListener)
        console.log('Keyboard input ready')
    },
    methods: {
        keyboardListener (e) {
            var pressed = {
                up: this.$data.config.up.includes(e.which),
                right: this.$data.config.right.includes(e.which),
                down: this.$data.config.down.includes(e.which),
                left: this.$data.config.left.includes(e.which),
                select: this.$data.config.select.includes(e.which),
                back: this.$data.config.back.includes(e.which),
                home: this.$data.config.home.includes(e.which)
            }
            var any = false
            Object.keys(pressed).forEach((key) => {
                if (pressed[key]) {
                    this.$emit('input', 'keyboard')
                    this.$emit('key', key)
                    any = true
                }
            })
            if (any) e.preventDefault()
        }
    }
})

export default Keyboard
