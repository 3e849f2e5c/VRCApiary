const {app, BrowserWindow} = require('electron');
const {session} = require('electron');
const storage = require('electron-json-storage');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    storage.has('login', function (error, hasKey) {
        if (error) throw error;

        if (hasKey) {
            storage.get('login', function (error, data) {
                if (error) throw error;
                console.log(data);
                const cookie = {url: 'https://api.vrchat.cloud/', name: 'apiKey', value: data['apiKey']};
                session.defaultSession.cookies.set(cookie, (error) => {
                    if (error) {
                        console.error(error);
                    }
                });
                mainWindow.loadFile('templates/login.html');
            });
        } else {
            mainWindow.loadFile('templates/apiKey.html')
        }
    });
    mainWindow.on('closed', function () {
        mainWindow = null
    });
    mainWindow.webContents.on('new-window', function (event, url) {
        event.preventDefault();
        require('electron').shell.openExternal(url);
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});