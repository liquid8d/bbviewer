// #if process.env.BUILD_TARGET != 'web'
import { ipcRenderer } from 'electron'
// #endif

const Utils = {
    data () {
        return {
            isDragging: false,
            dragElement: null,
            x: 0,
            y: 0
        }
    },
    methods: {
        open (link) {
            // #if process.env.BUILD_TARGET === 'web'
            window.open(link, '', 'toolbar=no, location=no, width=800, height=360')
            // #else
            require('electron').shell.openExternal(link)
            // #endif
        },
        preventDraggables () {
            // prevent certain objects from being dragged for a more app-like experience
            document.querySelectorAll('a, img').forEach(element => {
                element.draggable = false
            })
            document.querySelectorAll('h1, h2, h3, p, span, div').forEach(element => {
                element.style.cursor = 'default'
            })
        },
        setDraggable (el) {
            this.dragElement = el
            el.addEventListener('mousedown', this.startDrag)
            el.addEventListener('mousemove', this.dragWindow)
            el.addEventListener('mouseup', this.stopDrag)
            document.body.addEventListener('mouseleave', this.stopDrag)
        },
        startDrag (e) {
            this.isDragging = true
            this.x = e.pageX
            this.y = e.pageY
        },
        stopDrag () {
            this.isDragging = false
            this.x = this.y = 0
        },
        dragWindow (e) {
            if (this.isDragging) {
                var x = e.pageX - this.x
                var y = e.pageY - this.y
                // #if process.env.BUILD_TARGET === 'web'
                window.moveTo(window.screenX + x, window.screenY + y)
                // #else
                ipcRenderer.send('window.drag', { x: x, y: y })
                // #endif
            }
        },
        unfocus (e) {
            document.activeElement.blur()
        },
        fullscreen (el, forced) {
            forced = forced || false
            // launch element in fullscreen, defaults to document.body
            var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
                (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
                (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
                (document.msFullscreenElement && document.msFullscreenElement !== null)

            if (!isInFullScreen || forced) {
                if (el === undefined) el = document.body
                if (el.requestFullscreen) {
                    el.requestFullscreen()
                } else if (el.mozRequestFullScreen) {
                    el.mozRequestFullScreen()
                } else if (el.webkitRequestFullScreen) {
                    el.webkitRequestFullScreen()
                } else if (el.msRequestFullscreen) {
                    el.msRequestFullscreen()
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen()
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen()
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                }
            }
        },
        setWindowTitle (arg) {
            // #if process.env.BUILD_TARGET === 'web'
            document.title = arg.title || arg
            // #else
            require('electron').ipcRenderer.send('window.title', { title: arg.title || arg })
            // #endif
        },
        setWindowOnTop (ontop) {
            // #if process.env.BUILD_TARGET === 'web'
            console.log('web browser does not support always on top')
            // #else
            require('electron').ipcRenderer.send('window.ontop', ontop)
            // #endif
        },
        createNewWindow () {
            // #if process.env.BUILD_TARGET === 'web'
            window.open('index.html', '', 'toolbar=no, location=no, width=800, height=360')
            // #else
            require('electron').ipcRenderer.send('window.new')
            // #endif
        },
        resizeWindow (width, height) {
            // #if process.env.BUILD_TARGET === 'web'
            window.resizeTo(width, height)
            // #else
            require('electron').ipcRenderer.send('window.size', { width, height })
            // #endif
        },
        restartApp () {
            // #if process.env.BUILD_TARGET === 'web'
            location.reload(true)
            // #else
            require('electron').ipcRenderer.send('app.restart')
            // #endif
        },
        screenshot (opts) {
            // #if process.env.BUILD_TARGET === 'web'
            console.log('web browser does not support screenshot')
            // #else
            ipcRenderer.send('app.screenshot', opts)
            // #endif
        },
        chooseFolder () {
            // #if process.env.BUILD_TARGET != 'web'
            return ipcRenderer.sendSync('app.choose_folder')[0]
            // #endif
        },
        environment () {
            return this.$store.state.environment
        },
        isElectron () {
            return this.$store.state.isElectron
        }
    }
}

export default Utils
