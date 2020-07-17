/**
 * Preload script is loaded before the BrowserWindow load its HTML file.
 * Using preload instead of setting
 *   webPreferences: {
 *     nodeIntegration: true
 *   }
 * will mitigate the security risks. So should definitely consider using preload scripts.
 *
 * To preload a script, set the following option when creating the BrowserWindow
 *   new BrowserWindow({
 *     webPreferences: {
 *       preload: `${__dirname}/write-file/preload.js`
 *     }
 *   })
 */
const { remote } = require('electron')
const fs = require('fs')

console.log('Run this script before the HTML template is loaded (preload script)')
console.log(remote.screen)

window.saveToFile = () => {
  const textContents = document.querySelector('#textContents').value
  console.log(textContents)

  // Should use dialog.showSaveDialog to let users select location and file name
  // of the file to which textContents will be saved
  const filePath = remote.app.getPath("desktop") + '/TextEditor.txt'

  fs.writeFile(
    filePath,
    textContents,
    err => console.log(err)
  )
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector('#saveToFile').addEventListener('click', e => {
    window.saveToFile()
  })
})
