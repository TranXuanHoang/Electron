const { app, BrowserWindow } = require('electron')
const windowStateKeeper = require('electron-window-state')

// Should keep a global reference of the main window object,
// otherwise it it will be automatically closed when JavaScript
// garbage collects memories that are not refered to anymore
let mainWindow

// Create a new app window (BrowserWindow) when the app is ready
function createMainWindow() {
  // Load the previous state with fallback to defaults
  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  })

  // Create the window using the state information
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(mainWindow)

  // Load index.html into the BrowserWindow
  mainWindow.loadFile('index.html')

  // Open DevTools if is not in production mode
  if (process.env !== 'production') {
    // Note that, openDevTools may cause some APIs working incorrectly, so should
    // comment the following line of code when testing and facing strange thing
    mainWindow.webContents.openDevTools()
  }

  // Listen for window being close, then free the memory
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createMainWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})
