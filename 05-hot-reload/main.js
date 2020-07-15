const electron = require('electron')
const { app, BrowserWindow, ipcMain, dialog, Menu } = electron
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
    // mainWindow.webContents.openDevTools()
  }

  // Listen for window being close, then free the memory
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function downloadImage() {
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // Specify the location for saving file (this is optional, default location is 'Download' folder)
    item.setSavePath(app.getPath("desktop") + `/${item.getFilename()}`)

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Recieved bytes: ${item.getReceivedBytes()}`)
          let percentDone = Math.round((item.getReceivedBytes() / item.getTotalBytes()) * 100)
          console.log(`${percentDone}% finished`)

          // Update the progress bar on screen
          // The following method is not a good practice. Should use IPC to update
          // the UI instead
          webContents.executeJavaScript(`window.progress.value = ${percentDone}`)
        }
      }
    })

    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })
}

function showDialogs() {
  ipcMain.on('open:files', () => {
    dialog.showOpenDialog(mainWindow, {
      title: 'Open',
      message: 'Select files/folders to open',
      defaultPath: `${app.getPath('downloads')}`,
      properties: ["openFile", "multiSelections"]
    }).then(value => {
      console.log(value)
      mainWindow.send('dialogResult', { operation: "Open Dialog", value: value })
    }).catch(err => {
      console.log(err)
    })
  })

  ipcMain.on('save:file', () => {
    dialog.showSaveDialog(mainWindow, {
      title: 'Save',
      message: 'Select location to save',
      defaultPath: `${app.getPath('downloads')}`,
      properties: ["createDirectory", "showOverwriteConfirmation"]
    }).then(value => {
      console.log(value)
      mainWindow.send('dialogResult', { operation: "Save File", value: value })
    }).catch(err => {
      console.log(err)
    })
  })

  ipcMain.on('notification', () => {
    const menu = ['Rice', 'Eggs', 'Meat', 'Wine']
    dialog.showMessageBox(mainWindow, {
      message: "What do you want to have?",
      buttons: menu
    }).then(value => {
      console.log(value)
      mainWindow.send('dialogResult',
        {
          operation: 'Notification',
          value: {
            question: 'What do you want to have',
            answer: menu[value.response]
          }
        })
    })
  })
}

function handleRightClick() {
  // Show an edit menu when user right clicks
  const contextMenu = Menu.buildFromTemplate([
    { role: "toggleDevTools" },
    { role: "viewMenu" },
    { role: "editMenu" }
  ])

  mainWindow.webContents.on('context-menu', event => {
    contextMenu.popup()
  })
}

function powerMonitor() {
  // Handle the power events of the machine
  // Note that, we can only call powerMonitor when the app is 'ready'
  electron.powerMonitor.on('suspend', event => {
    // In the real app, this event listener could be used to save data before
    // the app is suspended
    console.log('App is suspended')
  })

  electron.powerMonitor.on('lock-screen', event => {
    console.log('Screen is locked')
  })

  electron.powerMonitor.on('unlock-screen', event => {
    console.log('Screen is unlocked')
    dialog.showMessageBox(mainWindow, {
      message: 'Welcome back',
      buttons: ['OK']
    })
  })
}

app.on('ready', () => {
  createMainWindow()

  downloadImage()

  showDialogs()

  handleRightClick()

  powerMonitor()
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
    createMainWindow()
  }
})
