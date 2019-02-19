const notify = require('electron-main-notification');

const sendDesktopNotification = (message, onclick) => {
    notify(message, { body: 'honestly' }, () => {
        console.log('The notification got clicked on!')
    })
};

module.exports = {
    sendDesktopNotification: (message, callback) => {
        sendDesktopNotification(message, callback);
    }
};