const electron = require('electron');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const { app, BrowserWindow, ipcMain, shell } = electron;

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false
    },
    height: 600,
    width: 800
  });

  mainWindow.loadFile('./src/index.html');
});

ipcMain.on('videos:added', (event, videos) => {
  // Wrap each video metadata retrieving logic in a promise
  // and put these promises in an array
  const promises = videos.map((video) => {
    return new Promise((resolve, reject) => {
      // Get video file metadata
      ffmpeg.ffprobe(video.path, (err, metadata) => {
        resolve({
          ...video,
          duration: metadata.format.duration,
          format: 'avi'
        });
      });
    });
  });

  // Use Promise.all to wait for all promises finish (resolve) its logic
  // before returning metadata of all videos back to the React side
  Promise.all(promises)
    .then(results => {
      mainWindow.send('metadata:complete', results);
    });
});

ipcMain.on('conversion:start', (event, videos) => {
  videos.forEach(video => {
    const filePath = path.parse(video.path);
    const outputDirectory = filePath.dir;
    const outputName = filePath.name;
    const outputPath = path.join(outputDirectory, `${outputName}.${video.format}`);

    ffmpeg(video.path)
      .on('progress', (progress) => {
        // Note that the 'progess.percent' may be inaccurate
        // (see https://www.npmjs.com/package/fluent-ffmpeg#progress-transcoding-progress-information)
        console.log('Processing: ' + progress.percent + '% done');

        // So we pass timemark back to React side and let it determine the percent of the progress
        mainWindow.webContents.send('conversion:progress', { video, timemark: progress.timemark });
      })
      .on('error', (err) => {
        // Can send an error message to the renderer process and let user know about the error.
        // Here we simple print out the error log for dev purpose.
        console.log('An error occurred: ' + err.message);
      })
      .on('end', (stdout, stderr) => {
        // console.log(`Processing finished! '${filePath.name}${filePath.ext}' was converted to '${filePath.name}.${video.format}'`);
        mainWindow.webContents.send('conversion:end', { video, outputPath });
      })
      .save(outputPath);
  });
});

ipcMain.on('folder:open', (event, outputPath) => {
  shell.showItemInFolder(outputPath);
});
