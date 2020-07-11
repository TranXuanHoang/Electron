const electron = require('electron');
const { BrowserWindow } = electron;

class MainWindow extends BrowserWindow {
  constructor(filePath) {
    super({
      webPreferences: {
        nodeIntegration: true
      },
      height: 500,
      width: 300,
      frame: false,
      resizable: false,
      show: false
    });

    this.loadFile(filePath);

    this.on('blur', this.onBlur.bind(this));
  }

  // Hide the main window when user clicks to area outside of it and not the tray icon as well.
  // Note that the 'blur' event handling here interferes with the tray.on('click'), so
  // clicking tray icon will not toggle the mainWindow as we expected
  onBlur() {
    this.hide();
  }
}

module.exports = MainWindow;
