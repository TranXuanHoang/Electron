const electron = require('electron');
const path = require('path');
const MainWindow = require('./app/main_window');
const TimerTray = require('./app/timer_tray');

const { app, ipcMain } = electron;

let mainWindow;
let tray;

app.on('ready', () => {
  // Hide the app icon from the user's dock on MacOS
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  // Define the main window of the app
  mainWindow = new MainWindow('./src/index.html');

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

ipcMain.on('timer-update', (event, timeLeft) => {
  if (process.platform === 'darwin') {
    // setTitle only supports macOS
    tray.setTitle(timeLeft);
  } else {
    tray.setToolTip(timeLeft === '' ? 'Timer App' : `Timer App | Time remaining: ${timeLeft}`);
  }
});
