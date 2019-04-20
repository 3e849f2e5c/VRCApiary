const fs = require('fs');
const Tail = require('always-tail2');
let client;
const WebSocket = require('ws');
const {app} = require('electron');
const main = require('./main.js');

const logFolder = require('os').homedir() + "\\AppData\\LocalLow\\VRChat\\vrchat\\";
let status = "In app";
let world = "Not in game";
let sendNotifications = true;

let parserEnabled = false;
let discordEnabled = false;
let notifyEnabled = false;

if (discordEnabled === true) {
    client = require('discord-rich-presence')('551621567948390401');
}

/**
 * Ice Cream edition websocket
 * @type {WebSocketServer}
 */
const wss = new WebSocket.Server({port: 42165});

/**
 * Current connection
 */
let socket;

/**
 * On WebSocket connected
 */
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('received: %s', message);
    });
    console.log("connected");
    if (socket !== undefined) {
        // close previous connection
        socket.close(1000);
    }
    socket = ws;
});


let tail;
let interval;

const enableParser = () => {
    if (parserEnabled === true) {
        return;
    }
    parserEnabled = true;
    start();
};

const disableParser = () => {
    if (parserEnabled === false) {
        return;
    }
    parserEnabled = false;
    tail.unwatch();
    clearInterval(interval);
};

const enableDiscord = () => {
    if (discordEnabled === true) {
        return;
    }
    discordEnabled = true;
    client = require('discord-rich-presence')('551621567948390401');
    updateDiscord();
};

const disableDiscord = () => {
    if (discordEnabled === false) {
        return;
    }
    discordEnabled = false;
    client.disconnect();
};

const enableNotifications = () => {
    if (notifyEnabled === true) {
        return;
    }
    notifyEnabled = true;
};

const disableNotifications = () => {
    if (notifyEnabled === false) {
        return;
    }
    notifyEnabled = false;
};

const isVRChatConnected = () => {
    return (tail !== undefined);
};

const isIceCreamConnected = () => {
    return (socket !== undefined && socket.readyState === 1);
};

const sendNotification = (title, text, icon) => {
    main.sendNotification(title, text, icon);
};

const start = () => {
    status = "In app";
    world = "Not in game";
    updateDiscord();
    getAvailableLogFiles((logs) => {
        const options = {
            interval: 500,
            startAtEnd: true
        };
        tail = new Tail(logFolder + logs[0].name, /\n{1,4}\r\n/, options);
        interval = setTimeout(() => {
            tail.unwatch();
            tail = undefined;
            if (parserEnabled === true) {
                start();
            }
            console.log("reset");
        }, 30000);
        tail.on("line", function (data) {
            parse(data);
            clearTimeout(interval);
            interval = setTimeout(() => {
                tail.unwatch();
                tail = undefined;
                main.sendToWindow('VRChatConnected', "false");
                if (parserEnabled === true) {
                    start();
                }
                console.log("reset");
            }, 30000);
        });
    });
};

const updateDiscord = (time) => {
    if (discordEnabled === false) {
        return;
    }
    const i = {
        state: world,
        details: status,
        largeImageKey: 'logo',
        largeImageText: 'VRCApiary ' + app.getVersion()
    };
    if (time !== undefined && time === true) {
        i.startTimestamp = Date.now();
    }
    client.updatePresence(i);
};

const parse = (line) => {
    parseWithRegex(line, "[RoomManager] Entering Room:", /^.+ - {2}\[RoomManager] Entering Room: (.+)/, (match) => {
        world = match[1];
        status = "In game";
        updateDiscord(true);
    });

    parseWithRegex(line, "[NetworkManager] OnPlayerJoined", /^.+ - {2}\[NetworkManager] OnPlayerJoined (.+)/, (match) => {
        if (sendNotifications === true && notifyEnabled === true) {
            if (socket !== undefined && socket.readyState === 1) {
                socket.send("<color=green><b>" + match[1] + "</b></color> joined the instance");
                console.log(match[1] + " joined the instance");
            } else {
                sendNotification("User joined the instance", match[1], "../css/images/notifications/join.png");
            }
        }
    });

    parseWithRegex(line, "[NetworkManager] OnPlayerLeft", /^.+ - {2}\[NetworkManager] OnPlayerLeft (.+)/, (match) => {
        if (sendNotifications === true && notifyEnabled === true) {
            if (socket !== undefined && socket.readyState === 1) {
                socket.send("<color=red><b>" + match[1] + "</b></color> left the instance");
                console.log(match[1] + " left the instance");
            } else {
                sendNotification("User left the instance", match[1], "../css/images/notifications/leave.png");
            }
        }
    });

    parseOnly(line, "Room transition time:", () => {
        sendNotifications = false;
    });

    parseOnly(line, "[VRCFlowManagerVRC] Destination set", () => {
        sendNotifications = true;
    });

    parseOnly(line, "[NetworkManager] OnDisconnected", () => {
        status = "In app";
        world = "Not in game";
        updateDiscord();
    });
};

const parseWithRegex = (line, trigger, regex, action) => {
    if (line.indexOf(trigger) !== -1) {
        const match = regex.exec(line);
        if (match !== null && match.length > 0) {
            action(match);
        }
    }
};

const parseOnly = (line, trigger, action) => {
    if (line.indexOf(trigger) !== -1) {
        action();
    }
};

const getAvailableLogFiles = (callback) => {
    const logs = [];
    fs.readdir(logFolder, (err, items) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].indexOf("output_log_") !== -1) {
                const stats = fs.statSync(logFolder + items[i]);
                logs.push({
                    name: items[i],
                    modif: new Date(stats.mtime)
                });
            }
        }
        logs.sort((a, b) => {
            return (b.modif === undefined ? 0 : b.modif.getTime()) - (a.modif === undefined ? 0 : a.modif.getTime());
        });
        callback(logs);
    });
};

module.exports = {
    start: () => {
        start();
    },
    enableParser: () => {
        enableParser();
    },
    disableParser: () => {
        disableParser();
    },
    enableDiscord: () => {
        enableDiscord();
    },
    disableDiscord: () => {
        disableDiscord();
    },
    enableNotifications: () => {
        enableNotifications();
    },
    disableNotifications: () => {
        disableNotifications();
    },
    isVRChatConnected: () => {
        return isVRChatConnected();
    },
    isIceCreamConnected: () => {
        return isIceCreamConnected();
    }
};