const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

app.on('ready', () => {
  // Open up a main window when the app started up
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadFile('main.html');

  // Setup and show an app menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

// Define the app menu template with label and submenu items
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { label: 'New Todo' },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

// Tweak the menu on MacOS so that all menu items will be shown as expected
if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

// Only show the 'View' menu if the app doesn't run in production
if (process.env !== 'production') {
  menuTemplate.push(
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
          click(item, forcusedWindow) {
            forcusedWindow.toggleDevTools();
          }
        }
      ]
    }
  );
}
