import Vue from 'vue'

const Touch = new Vue({
    data () {
        return {
            config: {
                enabled: false
            }
        }
    },
    created () {
        if (this.$data.config.enabled) {
            document.addEventListener('touchstart', this.onTouchStart)
            document.addEventListener('touchend', this.onTouchEnd)
            console.log('Touch input ready')
        } else {
            console.log('Touch input disabled')
        }
    },
    methods: {
        onTouchStart (e) {
            this.$emit('input', 'touch')
        },
        onTouchEnd (e) {
            console.log('got a touch!')
            if (e.target.tagName === 'TEXTAREA' ||
                (e.target.tagNAME === 'INPUT' && (e.target.type === 'text' || e.target.type === 'password'))) {
                this.$emit('osk', 'show')
                e.preventDefault()
            }
        }
    }
})

export default Touch
