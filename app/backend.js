var app = require('app')
var BrowserWindow = require('browser-window')
var globalShortcut = require('global-shortcut')

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

  mainWindow.loadUrl('file://' + __dirname + '/app.html')

  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
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