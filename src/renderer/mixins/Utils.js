import { ipcRenderer } from 'electron'

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
            el.addEventListener('onmousedown', this.startDrag)
            el.addEventListener('onmousemove', this.dragWindow)
            el.addEventListener('onmouseup', this.stopDrag)
            el.addEventListener('onmouseleave', this.stopDrag)
        },
        startDrag (e) {
            console.log('start drag')
            this.isDragging = true
            this.x = e.pageX
            this.y = e.pageY
        },
        stopDrag () {
            this.x = this.y = 0
        },
        dragWindow (e) {
            console.log('drag')
            if (this.isDragging) {
                var x = e.pageX - this.x
                var y = e.pageY - this.y
                ipcRenderer.send('window.drag', { x: x, y: y })
            }
        },
        setWindowTitle (arg) {
            if (this.isElectron) {
                require('electron').ipcRenderer.send('window.title', { title: arg.title || arg })
            } else {
                document.title = arg.title || arg
            }
        },
        setWindowOnTop (ontop) {
            if (this.isElectron) {
                require('electron').ipcRenderer.send('window.ontop', ontop)
            }
        },
        createNewWindow () {
            if (this.isElectron) {
                require('electron').ipcRenderer.send('window.new')
            } else {
                window.open('index.html', '', 'toolbar=no, location=no, width=800, height=360')
            }
        },
        resizeWindow (width, height) {
            if (this.isElectron) {
                require('electron').ipcRenderer.send('window.size', { width, height })
            } else {
                window.resizeTo(width, height)
            }
        },
        restartApp () {
            if (this.isElectron) {
                require('electron').ipcRenderer.send('app.restart')
            } else {
                location.reload(true)
            }
        },
        screenshot (opts) {
            if (this.isElectron) {
                ipcRenderer.send('app.screenshot', opts)
            }
        },
        chooseFolder () {
            if (this.isElectron) {
                return ipcRenderer.sendSync('app.choose_folder')[0]
            }
        },
        isElectron () {
            return this.$store.state.isElectron
        }
    }
}

export default Utils
