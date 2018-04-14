// Add PepperFlash support
const { app } = require('electron')
const path = require('path')
const fs = require('fs')

console.log(process.platform + ':' + process.arch)

let flashPath = ''
let data = null

function findFlash (pathList) {
    if (pathList.length > 0) {
        try {
            // read PepperFlash manifest and append flash path
            flashPath = pathList[0]
            console.log('checking ' + flashPath)
            return JSON.parse(fs.readFileSync(path.join(flashPath, 'manifest.json')).toString())
        } catch (err) {
            pathList.shift()
            return findFlash(pathList)
        }
    }
    flashPath = null
    return null
}

switch (process.platform) {
case 'win32':
    flashPath = (process.arch === 'x64') ? 'C:/Windows/System32/Macromed/Flash/' : 'C:/Windows/SysWOW64/Macromed/Flash/'
    try {
        // read PepperFlash manifest and append flash path
        let data = JSON.parse(fs.readFileSync(flashPath + 'manifest.json').toString())
        let version = data.version.split('.')
        console.log('found Flash version: ' + data.version)
        let flashFile = (process.arch === 'x64') ? '/pepflashplayer64_' + version[0] + '_' + version[1] + '_' + version[2] + '_' + version[3] + '.dll' : '/pepflashplayer32_' + version[0] + '_' + version[1] + '_' + version[2] + '_' + version[3] + '.dll'
        app.commandLine.appendSwitch('ppapi-flash-path', path.join(flashPath, flashFile))
    } catch (err) {
        console.log('could not locate Flash')
    }
    break
case 'darwin':
    data = findFlash([
        '/Library/Internet Plug-Ins/PepperFlashPlayer/'
    ])
    try {
        console.log('found Flash version: ' + data.version)
        app.commandLine.appendSwitch('ppapi-flash-path', path.join(flashPath, 'PepperFlashPlayer.plugin'))
    } catch (err) {
        console.log('could not locate Flash')
    }
    break
case 'linux':
case 'x64':
    data = findFlash([
        '/opt/google/chrome/PepperFlash',
        '/usr/lib/pepperflashplugin-nonfree/',
        '/usr/lib/PepperFlash/',
        '/usr/lib64/flash-plugin/libpepflashplayer.so',
        '/usr/lib/adobe-flashplugin'
    ])
    try {
        console.log('found Flash version: ' + data.version)
        app.commandLine.appendSwitch('ppapi-flash-path', path.join(flashPath, 'libpepflashplayer.so'))
    } catch (err) {
        console.log('could not locate Flash')
    }
    break
}
