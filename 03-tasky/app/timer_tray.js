const electron = require('electron');
const { Tray } = electron;

class TimerTray extends Tray {
  constructor(iconPath, mainWindow) {
    super(iconPath);
    this.mainWindow = mainWindow;
    this.setToolTip('Timer App');
    this.on('click', this.onClick.bind(this));
  }

  // Toggle the mainWindow when user clicks the tray icon
  onClick(event, bounds) {
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      // Mouse click event location
      const { x, y } = bounds;

      // Window heigh and width
      const { height, width } = this.mainWindow.getBounds();

      // Calculate the y position based on the OS on which the app will run
      const yPosition = process.platform === 'darwin' ? y : y - height;

      // Position the window right before showing it
      this.mainWindow.setBounds({
        x: x - width / 2,
        y: yPosition,
        width,
        height
      });

      this.mainWindow.show();
    }
  }
}

module.exports = TimerTray;
