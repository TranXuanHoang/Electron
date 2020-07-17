# Overview

[![made-with-Electron](https://img.shields.io/badge/Made%20with-Electron-1f425f.svg)](https://www.electronjs.org/)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://mit-license.org/)

A demo cross-platform desktop application written with Electron with the following features:

* Project can be hot reloaded during the development step
* Provides an example of downloading file into local machines
* Opening dialogs for opening/saving files and showing message box
* Popup a context menu when right clicking on the app window
* App looks into the power event to act accordingly
* Toggle full screen mode and open PDF files
* Zoom screen bigger/smaller or reset back to normal
* Take captures of the screen or the app
* Get notifications

The project source code is set up to use the following npm dependencies

|Package |Purpose |
|--------|--------|
|[nodemon](https://www.npmjs.com/package/nodemon) | Automatically reloads app whenever saving changes of Electron logic files|
|[electron-window-state](https://www.npmjs.com/package/electron-window-state) |Stores and restores window sizes and positions for the Electron app |

## To run the app

* Install dependencies:
`npm install`

* Run app with hot reload:
`npm run watch`

* Run app without hot reload:
`npm run start`
