const electron = require('electron');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const { app, BrowserWindow, ipcMain } = electron;

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

    console.log('______');
    console.log(outputDirectory);
    console.log(outputName);
    console.log(outputPath);

    ffmpeg(video.path)
      .on('progress', (progress) => {
        //TODO
        console.log('Processing: ' + progress.percent + '% done');
      })
      .on('error', (err) => {
        //TODO
        console.log('An error occurred: ' + err.message);
      })
      .on('end', (stdout, stderr) => {
        //TODO
        console.log(`Processing finished! '${filePath.name}${filePath.ext}' was converted to '${filePath.name}.${video.format}'`);
      })
      .save(outputPath);
  });
});
