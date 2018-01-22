/**
 * IPC Callbacks available to app
 */
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

// create new window
ipcMain.on('window.new', () => {
    let winURL = process.env.NODE_ENV === 'development'
        ? `http://localhost:9080`
        : `file://${__dirname}/index.html`

    let win = new BrowserWindow({
        title: 'BBViewer',
        width: 800,
        height: 450,
        backgroundColor: '#111',
        menu: null,
        useContentSize: false,
        webPreferences: {
            plugins: true,
            webSecurity: false
        }
    })

    win.loadURL(winURL)

    win.on('closed', () => {
        win = null
    })
})

// set window size
ipcMain.on('window.size', (event, arg) => {
    let focused = BrowserWindow.getFocusedWindow()
    focused.setSize(arg.width, arg.height)
})

// drag window
ipcMain.on('window.drag', (event, arg) => {
    let focused = BrowserWindow.getFocusedWindow()
    if (focused) focused.setPosition(focused.getPosition()[0] + parseInt(arg.x), focused.getPosition()[1] + parseInt(arg.y))
})

// set window ontop
ipcMain.on('window.ontop', (event, arg) => {
    let focused = BrowserWindow.getFocusedWindow()
    focused.setAlwaysOnTop(arg || !focused.isAlwaysOnTop())
})

// set window title
ipcMain.on('window.title', (event, arg) => {
    let focused = BrowserWindow.getFocusedWindow()
    focused.setTitle(arg.title)
})

// restart app
ipcMain.on('app.restart', () => {
    app.quit()
    app.relaunch()
})

// capture screenshot
ipcMain.on('app.screenshot', (event, arg) => {
    let focused = BrowserWindow.getFocusedWindow()
    focused.capturePage((img) => {
        let dir = path.join(app.getPath('documents'), 'bbviewer')
        let filename = new Date().getTime() + '.png'
        fs.mkdir(dir, () => {
            fs.writeFile(path.join(dir, filename), img.toPNG(), (err) => {
                if (err) console.warn('unable to create screenshot')
            })
        })
    })
})

// choose folder
ipcMain.on('app.choose_folder', (event) => {
    try {
        event.returnValue = dialog.showOpenDialog({
            properties: ['openDirectory', 'createDirectory']
        })
    } catch (err) {
        event.returnValue = ''
    }
})
