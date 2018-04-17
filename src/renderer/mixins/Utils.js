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
        getPlugins () {
            return this.$store.state.plugins
        },
        getPlugin (id) {
            return this.$store.state.plugins[id]
        },
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
            if (this.dragElement) {
                this.dragElement.removeEventListener('mousedown', this.startDrag)
                this.dragElement.removeEventListener('mousemove', this.dragWindow)
                this.dragElement.removeEventListener('mouseup', this.stopDrag)
            }
            if (el) {
                this.dragElement = el
                el.addEventListener('mousedown', this.startDrag)
                el.addEventListener('mousemove', this.dragWindow)
                el.addEventListener('mouseup', this.stopDrag)
                document.body.addEventListener('mouseleave', this.stopDrag)
            }
        },
        startDrag (e) {
            this.isDragging = true
            this.x = e.pageX
            this.y = e.pageY
        },
        stopDrag (e) {
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
        minimizeWindow () {
            // #if process.env.BUILD_TARGET !== 'web'
            require('electron').ipcRenderer.send('window.minimize')
            // #endif
        },
        maximizeWindow () {
            // #if process.env.BUILD_TARGET !== 'web'
            require('electron').ipcRenderer.send('window.maximize')
            // #endif
        },
        closeWindow () {
            // #if process.env.BUILD_TARGET !== 'web'
            require('electron').ipcRenderer.send('window.close')
            // #endif
        },
        quit () {
            // #if process.env.BUILD_TARGET !== 'web'
            require('electron').ipcRenderer.send('app.quit')
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
        },
        fetchUrl (url, opts) {
            if (!url) return
            opts.url = url
            if (opts.jsonp) {
                window[opts.callbackName] = function (data) {
                    delete window[opts.callbackName]
                    opts.callback(data)
                }
                var script = document.createElement('script')
                script.src = opts.url + (opts.url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + opts.callbackName
                document.head.appendChild(script)
                document.head.removeChild(script)
            } else {
                if (!opts.method) opts.method = 'GET'
                if (!opts.timeout) opts.timeout = 5000
                if (opts.begin) opts.begin(url, opts)
                var xhr = new XMLHttpRequest()
                xhr.onreadystatechange = function () {
                    // console.log(xhr.readyState + ": " + xhr.status)
                    // console.log(xhr.readyState + ':' + xhr.status + ':' + xhr.responseText)
                    var response = {}
                    if (xhr.readyState === 4 && xhr.status === 200 && xhr.responseText) {
                        response.status = xhr.status
                        response.data = (opts.json) ? JSON.parse(xhr.responseText) : xhr.responseText
                        if (opts.complete) opts.complete(response)
                    }
                }
                xhr.open(opts.method, url, true)
                if (opts.headers) {
                    Object.keys(opts.headers).forEach(function (key) {
                        console.log('adding header ' + key + ' ' + opts.headers[key])
                        try {
                            xhr.setRequestHeader(key, opts.headers[key])
                        } catch (e) {
                            console.dir(e)
                            console.log('error adding header ' + key)
                        }
                    })
                }
                if (opts.method === 'POST') {
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
                    if (opts.data) xhr.send(opts.data); else xhr.send()
                } else {
                    xhr.send()
                }
            }
        }
    }
}

export default Utils
