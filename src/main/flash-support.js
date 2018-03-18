// Add Flash support
const { app } = require('electron')
const path = require('path')

let pluginName
console.log(process.platform + ':' + process.arch)
switch (process.platform) {
case 'win32':
    switch (process.arch) {
    case 'x64':
        pluginName = '/pepper/pepflashplayer-x64.dll'
        break
    default:
        pluginName = '/pepper/pepflashplayer.dll'
        break
    }
    break
case 'darwin':
    pluginName = '/pepper/PepperFlashPlayer.plugin'
    break
case 'linux':
case 'x64':
    switch (process.arch) {
    case 'x64':
        pluginName = '/pepper/libpepflashplayer-x64.so'
        break
    default:
        pluginName = '/pepper/libpepflashplayer.so'
        break
    }
    break
}

app.commandLine.appendSwitch('ppapi-flash-path', path.join(__static, pluginName))
