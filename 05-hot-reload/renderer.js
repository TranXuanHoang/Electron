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
