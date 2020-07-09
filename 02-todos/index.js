const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  // Open up a main window when the app started up
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadFile('main.html');

  // Make sure to close all windows when user closes the app
  mainWindow.on('closed', () => { app.quit(); });

  // Setup and show an app menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

// Define a function to create a new window
function createAddWindow() {
  addWindow = new BrowserWindow({
    title: 'Add Todo',
    height: 200,
    width: 300,
    webPreferences: {
      nodeIntegration: true
    }
  });
  addWindow.loadFile('add.html');

  // Let the garbage collection frees the memory occupied by the addWindow when it is closed.
  // The addWindow is closed by calling addWindow.close() after clicking 'Add' submit button
  // on the 'Add Todo' screen.
  addWindow.on('closed', event => addWindow = null);
}

// Listen to the 'todo:add' event triggered by the 'add.html' screen,
// then send the 'todo' data to the 'main.html' screen
ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

// Define the app menu template with label and submenu items
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Todo',
        accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
        click() { createAddWindow(); }
      },
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
