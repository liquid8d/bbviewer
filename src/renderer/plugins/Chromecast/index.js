import Vue from 'vue'
// #if process.env.BUILD_TARGET != 'web'
import chromecast from 'electron-chromecast'
// #endif
const Chromecast = {
    CASTAPI: null,
    READY: false,
    AVAILABLE: false,
    APPID: undefined,
    NAMESPACE: undefined,
    SESSION: undefined,
    RECEIVERS: undefined,
    RECEIVER: 0,
    onFoundReceivers: undefined,
    install (vue, options) {
        Vue.prototype.$chromecast = this
    },
    start (appId, namespace) {
        if (!Chromecast.READY) {
            // do initial hook to window.chrome
            Chromecast.APPID = appId
            Chromecast.NAMESPACE = namespace
            if (process.env.BUILD_TARGET !== 'web') {
                Chromecast.CASTAPI = window.chrome.cast
                Chromecast.initialize()
            } else {
                // wait for window.chrome availability in a browser
                Chromecast.wait()
            }
        }
    },
    initialize () {
        var apiConfig = new Chromecast.CASTAPI.ApiConfig(
            new Chromecast.CASTAPI.SessionRequest(Chromecast.appId),
            Chromecast.sessionListener,
            Chromecast.receiverListener,
            Chromecast.CASTAPI.AutoJoinPolicy.ORIGIN_SCOPED
        )
        Chromecast.CASTAPI.initialize(apiConfig, Chromecast.onInitSuccess, Chromecast.onInitError)
        Chromecast.READY = true
    },
    isCasting () {
        return Chromecast.SESSION instanceof Chromecast.CASTAPI.Session
    },
    onInitSuccess () {
        console.log('chromecast is ready')
    },
    onInitError (e) {
        console.error('chromecast not initialized: ')
        console.dir(e)
    },
    onPlaySuccess () {
        console.log('chromecast play success')
    },
    onPlayError (e) {
        console.error('chromecast play error')
        console.dir(e)
    },
    onSendMsgSuccess (e) {
        console.log('chromecast sendmsg success')
        console.dir(e)
    },
    onSendMsgError (e) {
        console.error('chromecast sendmsg error')
        console.dir(e)
    },
    onSessionSuccess (e) {
        console.log('chromecast session success')
        console.dir(e)
        Chromecast.sendMessage('<b>Welcome</b> to BBViewer')
    },
    onSessionError (e) {
        console.error('chromecast session error: ' + e.code)
        console.dir(e)
    },
    onStopSessionSuccess () {
        console.log('chromecast session stopped')
        Chromecast.SESSION = undefined
    },
    onStopSessionError (e) {
        console.error('chromecast stop session error')
        console.dir(e)
    },
    pause () {
        console.log('pause chromecast')
    },
    play (url) {
        if (Chromecast.SESSION instanceof Chromecast.CASTAPI.Session) {
            var mediaInfo = new Chromecast.CASTAPI.media.MediaInfo(url)
            var request = new Chromecast.CASTAPI.media.LoadRequest(mediaInfo)
            request.autoplay = true
            // var loader =
            Chromecast.SESSION.loadMedia(request, Chromecast.onPlaySuccess, Chromecast.onPlayError)
        } else {
            console.error('no session available, could not play media')
        }
    },
    receiverListener (e) {
        console.log('receiver listener')
        Chromecast.AVAILABLE = Chromecast.CASTAPI.ReceiverAvailability.AVAILABLE
        console.dir(e)
        if (e === Chromecast.CASTAPI.ReceiverAvailability.AVAILABLE) {
            // force list refresh
            Chromecast.startSession(e)
        } else {
            console.warn('waiting for chromecast receivers')
        }
    },
    sendMessage (body) {
        if (Chromecast.SESSION === undefined) return
        Chromecast.SESSION.sendMessage(Chromecast.namespace, body, Chromecast.onSendMsgSuccess, Chromecast.onSendMsgError)
    },
    sessionListener (e) {
        console.log('chromecast session event')
        Chromecast.SESSION = e
        if (Chromecast.SESSION === undefined) {
            console.log('chromecast session ready')
        } else {
            console.error('no chromecast session available')
        }
    },
    startSession (e) {
        chromecast(async (receivers) => {
            Chromecast.RECEIVERS = receivers
            if (Chromecast.onFoundReceivers) Chromecast.onFoundReceivers.call(this, Chromecast.RECEIVERS)
            if (e && e.target.id) {
                for (var i = 0; i < receivers.length; i++) {
                    if (receivers[i].label === e.target.id) {
                        console.log('starting session on receiver ' + i)
                        Chromecast.RECEIVER = i
                        return new Promise((resolve, reject) => {
                            // resolve(receivers[Chromecast.RECEIVER])
                            reject(new Error('no receiver'))
                        })
                    }
                }
            }
            return new Promise((resolve, reject) => {
                reject(new Error('no receiver to use'))
            })
        })
        Chromecast.CASTAPI.requestSession(Chromecast.onSessionSuccess, Chromecast.onSessionError)
    },
    stopSession () {
        if (Chromecast.SESSION && Chromecast.SESSION.stop) {
            console.log('stopping chromecast session')
            Chromecast.SESSION.stop(Chromecast.onStopSessionSuccess, Chromecast.onStopSessionError)
        } else {
            console.log('no chromecast session to stop')
        }
    },
    stop () {
        console.log('stop chromecast')
    },
    wait () {
        // for browsers, wait until chrome.cast is available
        window['__onGCastApiAvailable'] = (available, error) => {
            if (available) {
                console.log('chromecast ready')
                Chromecast.CASTAPI = window.chrome.cast
                Chromecast.initialize()
            } else {
                console.error('chromecast  browser init error: ' + error)
            }
        }
    }
}

export default Chromecast
