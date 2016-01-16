import RemoteMessengerClient from './core/messaging-client'

import app from 'app'
import BrowserWindow from 'browser-window'
import globalShortcut from 'global-shortcut'
import ipc from 'ipc'

var shortcutsToCapture = ['Ctrl+Alt+Delete', 'Alt+F4', 'Ctrl+A']

// Report crashes to Electron server
require('crash-reporter').start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

app.on('ready', function () {

  var messengerClient = RemoteMessengerClient.CreateSocketIoClient({
    port: 5678
  })
  messengerClient.connect()

  captureShortcuts(shortcutsToCapture)

  var Screen = require('screen')
  var size = Screen.getPrimaryDisplay().size
  var width = size.width
  var height = size.height

  // Create the main browser window
  mainWindow = new BrowserWindow({
    'width': width,
    'height': height,
    'max-width': width,
    'max-height': height,
    'fullscreen': true,
    'auto-hide-menu-bar': true,
    'kiosk': true,
    'show': true,
    'resizable': false
  })

  mainWindow.on('closed', function() {

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  messengerClient.on('navigation.navigate-home').then((data) => {
    mainWindow.loadUrl('file://' + __dirname + '/home.html')
    mainWindow.webContents.on('did-finish-load', () => {
      console.log('Navigating home!!!')
      mainWindow.webContents.send('navigation.navigate-home', data)
    })
  })

  mainWindow.webContents.on('did-finish-load', () => {
    messengerClient.on('navigation.navigate-url').then((url) => {
      console.log('mc.navigation.navigate-url')
      mainWindow.loadUrl(url)
    })
    ipc.on('navigation.open-site-intent', (event, data) => {
      console.log('ipc.navigation.open-site-intent:', data)
      messengerClient.send('navigation.open-site-intent', data)
    })
    ipc.on('navigation.navigate-home-intent', () => {
      console.log('ipc.navigation.navigate-home-intent')
      messengerClient.send('navigation.navigate-home-intent')
    })
  })

})

function captureShortcuts(shortcuts) {
  shortcuts.forEach(function (shortcut) {
    registerShortcutCapturing(shortcut)
  })
}

function registerShortcutCapturing(shortcut) {
  var result = globalShortcut.register(shortcut, function () {
    console.log('<' + shortcut + '> captured!')
  })

  if (!result) {
    console.log('<' + shortcut + '> registration failed!')
  }
}
