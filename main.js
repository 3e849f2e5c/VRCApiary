if (require('electron-squirrel-startup')) return;
const {app, BrowserWindow, Menu, Tray} = require('electron');
const {session} = require('electron');
const trayWindow = require("electron-tray-window");
const storage = require('electron-json-storage');
const dl = require('electron-dl');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let taskbarWindow;
let tray = null;

const createTaskbarWindow = () => {
    tray = new Tray(path.join(__dirname, '/css/images/logo/icon.ico'));
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Item1', type: 'radio'},
        {label: 'Item2', type: 'radio'},
        {label: 'Item3', type: 'radio', checked: true},
        {label: 'Item4', type: 'radio'}
    ]);
    tray.setToolTip('This is my application.');
    tray.setContextMenu(contextMenu);
    taskbarWindow = new BrowserWindow({
        width: 300,
        height: 500,
        show: false,
        resizable: false,
        movable: false,
        skipTaskbar: true,
        frame: false,
        closable: false,
        alwaysOnTop: true,
        icon: path.join(__dirname, '/css/images/logo/icon.ico')
    });
    taskbarWindow.loadFile('templates/trayFriends.html');
    trayWindow.setOptions({tray: tray, window: taskbarWindow});
};

const createWindow = () => {
    console.log("ok");
    if (isDev) {
        app.setAppUserModelId(process.execPath);
    }
    mainWindow = new BrowserWindow({width: 800, height: 600, icon: path.join(__dirname, '/css/images/logo/icon.ico')});
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
};

const download = (url) => {
    dl.download(mainWindow, url, {saveAs: true, openFolderWhenDone: true});
};

app.on('ready', () => {
    createWindow();
    // createTaskbarWindow();
});

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

const sendNotification = (title, body, icon) => {
    mainWindow.webContents.send('notify', JSON.stringify({
        title: title,
        body: body,
        image: icon
    }));
};

const sendToWindow = (type, data) => {
    mainWindow.webContents.send(type, data);
};

const getClient = () => {
    return client;
};

module.exports = {
    download: (url) => {
        download(url);
    },
    sendNotification: (title, body, icon) => {
        sendNotification(title, body, icon);
    },
    sendToWindow: (type, data) => {
        sendToWindow(type, data);
    }
};
