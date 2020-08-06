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

* Build apps for each OS platform using the [`electron-builder` CLI](https://www.electron.build/cli). For example, the following command will build apps for both macOS, Windows and Linux:

    ```shell
    electron-builder -mwl
    ```

## Release App

[electron-builder](https://www.electron.build/) CLI provides options to publish apps packaged and built as described in the [Package and Build App](#package-and-build-app) section. See [electron-builder publish guide](https://www.electron.build/configuration/publish) for more information on how to release apps. _The configuration of this project (package.json) configs to release our app to [Github Release](https://docs.github.com/en/github/administering-a-repository/about-releases)_.

* Generate a _personal access token_ in `Github > Settings > Personal access tokens` and assign the token to a scope of `repo`.

* Go to the Github project repository and open `Releases`. Enter release `Tag version` (e.g. `v.1.0.0`); select `Target branch` (e.g. `master`); write `Release title` and `Description`; click `Save draft`;
then specify build configs in the `package.json` file like below

    ```json
    {
      ...,
      "scripts": {
        ...
        // on Windows only specify -wl as electron-builder
        // doesn't support generating macOS apps on Windows
        "release": "electron-builder -mwl --publish 'onTagOrDraft'",
        ...
      },
      "repository": {
        "url": "https://github.com/YourUserName/RepoName",
        "directory": "DirNameOfProjectSourceCode" // if have multiple PRJs in one repo
      },
      "build": {
        "appId": "...",
        "productName": "...",
        "copyright": "...",
        "publish": {
          "provider": "github"
        },
        ...
      }
    }
    ```

* Run `electron-builder` to publish app

    ```powershell
    # Mac
    GH_TOKEN=personal_access_token npm run release

    # Windows Cmd
    setx GH_TOKEN "personal_access_token" & npm run release

    # Windows PowerShell
    setx GH_TOKEN "personal_access_token" ; npm run release

    # Linux
    export GH_TOKEN=personal_access_token && npm run release
    ```

## Auto Update App

[electron-updater](https://www.electron.build/auto-update), an other package used together with `electron-builder`, supports updating apps on multiple OS platforms. Install the package by runing

```PowerShell
npm i electron-updater
```

For [debugging app auto update](https://www.electron.build/auto-update#debugging) with `electron-updater`, also install `electron-log`

```powershell
npm i electron-log

# Or install as a dev dependency only
npm i -D electron-log
```

Define an update module (e.g. [updater.js](./updater.js)) using `electron-updater` and `electron-log`, then import and call app update logic in the main app logic.
