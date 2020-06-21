const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {

    // ブラウザ(Chromium)の起動, 初期画面のロード
    mainWindow = new BrowserWindow({width: 800, height: 600,webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    //開発者ツール
    //mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});