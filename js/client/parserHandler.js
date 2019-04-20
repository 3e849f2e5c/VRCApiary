const main = require('electron');
const parser = main.remote.require('./parser.js');

const isVRChatConnected = () => {
    return parser.isVRChatConnected();
};

const isIceCreamConnected = () => {
    return parser.isIceCreamConnected();
};

const parserSettings = JSON.parse(localStorage.getItem("parserSettings"));
if (parserSettings.enableParser === true) {
    parser.enableParser();
} else {
    parser.disableParser();
}

if (parserSettings.enableDiscord === true) {
    parser.enableDiscord();
} else {
    parser.disableDiscord();
}

if (parserSettings.enableNotifications === true) {
    parser.enableNotifications();
} else {
    parser.disableNotifications();
}

main.ipcRenderer.on('notify', (event, message) => {
    const msg = JSON.parse(message);
    new Notification(msg.title, {
        body: msg.body,
        icon: msg.image
    });
});