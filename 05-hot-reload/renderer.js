/**
 * This renderer.js contains the Electron logic for the renderer process (web page).
 * We can use IPC (Inter-Process Communication) by explicitly sending and receiving
 * inter-process messages to/from the main process. Electron also provides 'remote'
 * module which provides a simpler way to do the IPC.
 */
const remote = require('electron').remote
const { dialog, BrowserWindow } = remote
const { webFrame, desktopCapturer } = require('electron')

document.querySelector('#fullScreen').addEventListener('click', event => {
  let win = remote.getCurrentWindow()
  if (win.isFullScreen()) {
    win.setFullScreen(false);
  } else {
    win.setFullScreen(true)
  }
})

document.querySelector('#openPdfFile').addEventListener('click', event => {
  dialog.showOpenDialog(remote.getCurrentWindow(), {
    title: 'Open PDF File',
    properties: ["openFile"],
    filters: [
      { name: 'PDFs', extensions: ['pdf'] }
    ]
  }).then(result => {
    // Open the PDF file if one was selected
    if (result.filePaths.length > 0) {
      let pdfViewer = new BrowserWindow({
        webPreferences: {
          plugins: true
        }
      })
      pdfViewer.loadFile(result.filePaths[0])
    }
  }).catch(err => {
    console.log(err)
    dialog.showMessageBox(remote.getCurrentWindow(), {
      message: `Cannot open any PDF files: ${err}`
    })
  })
})

document.querySelector('#zoomBigger').addEventListener('click', event => {
  webFrame.setZoomLevel(webFrame.getZoomLevel() + 1)
})

document.querySelector('#zoomSmaller').addEventListener('click', event => {
  webFrame.setZoomLevel(webFrame.getZoomLevel() - 1)
})

document.querySelector('#zoomReset').addEventListener('click', event => {
  webFrame.setZoomLevel(1)
})

document.querySelector('#captureScreen').addEventListener('click', () => {
  desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width: 1920, height: 1080 }
  }).then(async sources => {
    console.log(sources)
    document.querySelector('#captureImage').src = sources[0].thumbnail.toDataURL()
  }).catch(err => {
    console.log(err)
  })
})

document.querySelector('#captureApp').addEventListener('click', () => {
  desktopCapturer.getSources({
    types: ['window'],
    thumbnailSize: { width: 1920, height: 1080 }
  }).then(async sources => {
    console.log(sources)
    document.querySelector('#captureImage').src = sources[0].thumbnail.toDataURL()
  }).catch(err => {
    console.log(err)
  })
})

document.querySelector('#getNotifications').addEventListener('click', e => {
  let notification = new Notification('New Message', {
    body: 'A new message was recieved.'
  })

  notification.onclick = e => {
    // Bring the app window up to the screen
    win = remote.getCurrentWindow()
    if (!win.isVisible()) {
      win.show()
    }
    win.focus()
    notification = null

    // Display notification received message on the app window
    const li = document.createElement('li')
    const text = document.createTextNode(
      `Received a new notification at ${new Date().toLocaleTimeString()}`)
    li.appendChild(text)
    document.getElementById('notification').appendChild(li)
  }
})

document.querySelector('#openTextEditor').addEventListener('click', e => {
  let textEditor = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: `${__dirname}/write-file/preload.js`
    }
  })
  textEditor.loadFile('./write-file/write-file.html')
  textEditor.on('close', e => textEditor = null)
})
