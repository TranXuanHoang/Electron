# Overview

Build a cross-platform desktop app allowing users to bookmark websites and directly open them whenever they need.

## Run App

To run app locally during the app development:

* Install dependencies:
`npm install`

* Run app with hot reload:
`npm run watch`

* Run app without hot reload:
`npm run start`

## Package and Build App

[electron-builder](https://www.electron.build/) is used to package and build a ready for distribution app for macOS, Windows and Linux.

> **CI/CD service for Windows, Linux and macOS**
>
> * [AppVeyor](https://www.appveyor.com/) provides solutions for building, testing, and deploying apps that can run on both Windows, macOS and/or Linux.
>
> **Other Recommend Tools**
>
> * [CloudConvert](https://cloudconvert.com/) - To convert image files into other formats.
>
> * [favicon](https://favicon.io/) - To generate favicon images

Steps to package and build apps that are ready for release:

* Prepare app icons for different OSs: use the above tools to generate app icons for Linux (`.png`), Windows (`.ico`), macOS (`.icns`). Put all 3 icons into a directory named `build` under the project root directory - `electron-builder` will automatically look into this `build` dir and pick up an appropriate icon when building the app for corresponding OS.

* Specify build configurations for each OS platform - see `electron-builder`'s [configuration guide](https://www.electron.build/configuration/configuration) for more information.

* [Sign code](https://www.electron.build/code-signing) with trusted certificates: _code signing_ makes the app be trusted by OSs when being downloaded and installed. For Windows apps, [Comodo](https://comodosslstore.com/code-signing) as an example provides code signing certificates to protect the softwares. [Apple Developer Program](https://developer.apple.com/support/certificates/) provides digital certificates for macOS apps.

* Build apps for each OS platform using the [`electron-builder` CLI](https://www.electron.build/cli). For example, the following command will build apps for both macOS, Windows and Linux: <pre>electron-builder -mwl</pre>
