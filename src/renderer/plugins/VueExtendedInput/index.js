import Vue from 'vue'
import Keyboard from './Keyboard'
import Gamepad from './Gamepad'
import Mouse from './Mouse'
import Touch from './Touch'

const ExtendedInput = {
    state: {
        inputMethod: 'keyboard'
    },
    config: {
        theme: 'default',
        home: function () {
            // no default home action
        },
        back: function () {
            // default back action
            window.history.back()
        },
        select: function () {
            if (document.activeElement && document.activeElement.click) {
                document.activeElement.click()
            }
        },
        selector: [
            'button:not([disabled])',
            'a:not([disabled])',
            'ol > li:not([disabled])',
            'ul > li:not([disabled])',
            'div.ui:not([disabled])',
            'input:not([disabled])',
            'textarea:not([disabled])'
        ]
    },
    install (vue, options) {
        Vue.prototype.$extendedInput = this
        Keyboard.$on('key', this.onKey.bind(this))
        Gamepad.$on('key', this.onKey.bind(this))
        Keyboard.$on('input', this.onInputMethod.bind(this))
    },
    init (options) {
        if (!options) options = {}
        if (options.home) this.config.home = options.home
        if (options.back) this.config.back = options.back
        if (options.select) this.config.select = options.select

        // select first available el
        this.selectEl()

        console.log('Extended Input initialized')
    },
    onKey (key) {
        if (key === 'select') {
            // perform select action for this element
            this.config.select()
        } else if (key === 'back') {
            // perform back/cancel action
            this.config.back()
        } else if (key === 'home') {
            // perform home action
            this.config.home()
        } else {
            // find best element to select
            this.findMatch(key)
        }
    },
    onInputMethod (method) {
        this.state.inputMethod = method
        if (method !== 'mouse') {
            // disable mouse
            // Mouse.$emit('mouse', 'disable')
        }
    },
    findMatch (dir) {
        if (!document.activeElement) return
        var active = this.measure(document.activeElement)
        var potential = []
        var elements = document.body.querySelectorAll(this.config.selector.join(','))
        elements.forEach((val) => {
            if (val === active.el) return
            var obj = this.measure(val)
            obj.dist = Math.sqrt(Math.pow(obj.midX - active.midX, 2) + Math.pow(obj.midY - active.midY, 2))
            obj.dir = {
                up: obj.bottom < active.top,
                down: obj.top > active.bottom,
                left: obj.right < active.left,
                right: obj.left > active.right
            }
            if (obj.dir[dir]) potential.push(obj)
        })
        potential.sort((a, b) => a.dist - b.dist)
        if (potential.length > 0) this.selectEl(potential[0].el)
    },
    measure (el) {
        // provide an object with top/left/bottom/right/x/y/midX/midY values for comparison
        var m = {
            el,
            text: el.innerHTML,
            top: this.getOffset(el).top,
            left: this.getOffset(el).left,
            width: el.offsetWidth,
            height: el.offsetHeight
        }
        m.right = Math.abs(m.left + m.width)
        m.bottom = Math.abs(m.top + m.height)
        m.midX = m.left + m.width / 2
        m.midY = m.top + m.height / 2
        return m
    },
    getOffset (el) {
        // determine totaled offset for an element
        var _x = 0
        var _y = 0
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft
            _y += el.offsetTop - el.scrollTop
            el = el.offsetParent
        }
        return { top: _y, left: _x }
    },
    selectEl (el) {
        document.body.focus()
        if (!el) {
            el = document.querySelector(this.config.selector.join(','))
            el.focus()
        }
        el.focus()
        // console.log('selected: ' + el.tagName + '[type=' + el.type + '] ' + el.innerHTML)
    },
    Keyboard,
    Gamepad,
    Mouse,
    Touch
}

export default ExtendedInput
