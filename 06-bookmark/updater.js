/**
 * Configs app updating.
 */
const { dialog } = require("electron")
const { autoUpdater } = require("electron-updater")

// For debugging purpose (https://www.electron.build/auto-update#debugging)
// By default, it writes logs to the following locations:
//   on Linux: ~/.config/{app name}/logs/{process type}.log
//   on macOS: ~/Library/Logs/{app name}/{process type}.log
//   on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log
// Ref: https://github.com/megahertz/electron-log
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"

// Disable auto downloading of updates
autoUpdater.autoDownload = false

// Single export to check for and apply any available updates
module.exports = () => {
  // Check for available updates (GH Releases)
  autoUpdater.checkForUpdates()
    .then(checkResult => {
      autoUpdater.logger.info(`>> ${checkResult}`)
    })
    .catch(error => {
      autoUpdater.logger.error(error)
    })

  // Listen for update found
  autoUpdater.on('update-available', () => {
    // Prompt user to start download
    dialog.showMessageBox({
      type: 'info',
      title: 'Update available',
      message: 'A new version of Web Bookmark is available. Do you want to update now?',
      buttons: ['Update', 'No']
    }, buttonIndex => {
      // If button 0 (Update), start downloading the update
      if (buttonIndex === 0) autoUpdater.downloadUpdate()
    })
  })

  // Listen for update progress
  autoUpdater.on('download-progress', (progress, bytesPersecond, percent, total, transferred) => {
    autoUpdater.logger.info(`Downloading: ${progress}`)
    autoUpdater.logger.info(`Downloading Speed: ${bytesPersecond}`)
    autoUpdater.logger.info(`Downloaded: ${percent}%`)
    autoUpdater.logger.info(`Total: ${total}`)
    autoUpdater.logger.info(`Transfered: ${transferred}`)
    autoUpdater.logger.info('_____________________________________')
  })

  // Listen for update downloaded
  autoUpdater.on('update-downloaded', info => {
    // Prompt the user to install the update
    dialog.showMessageBox({
      type: 'info',
      title: 'Update ready',
      message: 'Install and restart now?',
      button: ['Yes', 'Later']
    }, buttonIndex => {
      // Install and restart if button 0 (Yes)
      // isSilent = false: show update installer when updating app on Windows
      // isForceRunAfter = true: restart app after update finished
      if (buttonIndex === 0) {
        autoUpdater.logger.info('==============UPDATE DOWNLOADED==============')
        autoUpdater.logger.info(info)
        autoUpdater.quitAndInstall(false, true)
      }
    })
  })
}
