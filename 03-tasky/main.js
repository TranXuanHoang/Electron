const electron = require('electron');
const path = require('path');

const { app, BrowserWindow, Tray } = electron;

let mainWindow;
let tray;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    height: 500,
    width: 300,
    frame: false,
    resizable: false,
    show: false
  });

  mainWindow.loadFile('./src/index.html');

  // Define the tray
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
  const iconPath = path.join(__dirname, `./src/assets/${iconName}`);
  tray = new Tray(iconPath);

  // Toggle the mainWindow when user clicks the tray icon
  tray.on('click', (event, bounds) => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      // Mouse click event location
      const { x, y } = bounds;

      // Window heigh and width
      const { height, width } = mainWindow.getBounds();

      // Calculate the y position based on the OS on which the app will run
      const yPosition = process.platform === 'darwin' ? y : y - height;

      // Position the window right before showing it
      mainWindow.setBounds({
        x: x - width / 2,
        y: yPosition,
        width,
        height
      });

      mainWindow.show();
    }
  });
});
