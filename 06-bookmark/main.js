/**
 * Logic for the main process
 */
const electron = require('electron')
const { app, BrowserWindow, ipcMain } = electron
const windowStateKeeper = require('electron-window-state')

let mainWindow

function createWindow() {
  // Load the previous state with fallback to default
  let mainWindowState = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 650
  })

  // Create the window using the state information
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 350, maxWidth: 650, minHeight: 300,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('renderer/index.html')

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(mainWindow)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
})

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
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Listen for new item request
ipcMain.on('new-item', (e, itemUrl) => {
  // Get new item and send back to renderer
  setTimeout(() => {
    e.sender.send('new-item-success', 'New item from main process')
  }, 2000)
})
