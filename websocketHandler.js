const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
const main = require("./main.js");

const startWebsocket = (token) => {
    console.log(token);
    const id = uuidv4();
    console.log(id);
    const ws = new WebSocket("wss://pipeline.vrchat.cloud/?authToken=" + token, "", {
        'headers': {
            'Cookie': "connectionId=" + id
        }
    });

    ws.onopen = (data) => {
        console.log("WebSocket connection opened");
    };
    ws.onclose = (data) => {
        main.sendToWindow("logout", "WebSocket connection was closed.");
        console.log("WebSocket connection interrupted");
    };
    ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        const type = data.type;
        const content = JSON.parse(data.content);
        switch (type) {
            case "friend-online": {
                if (content.user !== undefined) {
                    main.sendNotification("Friend logged in", content.user.displayName, content.user.currentAvatarThumbnailImageUrl);
                    main.sendToWindow(type, content);
                }
                console.log("FRIEND-ONLINE on " + content.user.displayName);
                break;
            }
            case "friend-active": {
                if (content.user !== undefined) {
                    main.sendNotification("Friend logged out", content.user.displayName, content.user.currentAvatarThumbnailImageUrl);
                }
                break;
            }
        }
    };
};

module.exports = {
    startWebsocket: (token) => {
        startWebsocket(token);
    }
};


