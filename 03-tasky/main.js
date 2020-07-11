const electron = require('electron');
const path = require('path');
const TimerTray = require('./app/timer_tray');

const { app, BrowserWindow } = electron;

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

  // The reason we assign the newly created TimerTray instance to the 'tray' variable
  // is to avoid JavaScript does garbage collections and frees the TimerTray object
  // - than will lead to the disappear of the tray. To avoid that, we just point to
  // the TimerTray using a variable and note that while an object is referred by any
  // variables, it will not be garbage collected.
  tray = new TimerTray(iconPath, mainWindow);
});
