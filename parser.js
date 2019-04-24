const fs = require('fs');
const Tail = require('always-tail2');
let client;
const WebSocket = require('ws');
const {app} = require('electron');
const main = require('./main.js');

const logFolder = require('os').homedir() + "\\AppData\\LocalLow\\VRChat\\vrchat\\";
let status = "In app";
let world = "Not in game";
let users = 0;
let type = "Public";
let date = Date.now();
let sendNotifications = true;

let parserEnabled = false;
let discordEnabled = false;
let notifyEnabled = false;

const exec = require('child_process').exec;

const isVRChatRunning = (query, cb) => {
    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32' :
            cmd = `tasklist`;
            break;
        case 'darwin' :
            cmd = `ps -ax | grep ${query}`;
            break;
        case 'linux' :
            cmd = `ps -A`;
            break;
        default:
            break;
    }
    exec(cmd, (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
};

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

let vrchatCheck;

let lastStatus = false;
let userCountUpdater;

const enableParser = () => {
    if (parserEnabled === true) {
        return;
    }
    parserEnabled = true;
    vrchatCheck = setInterval(() => {
        if (parserEnabled === false) {
            clearInterval(vrchatCheck);
            return;
        }

        isVRChatRunning('vrchat.exe', (status) => {
            if (lastStatus !== status) {
                lastStatus = status;
                return;
            }
            if (tail === undefined) {
                if (status === true) {
                    getAvailableLogFiles((logs) => {
                        if (logs.length === 0) {
                            return;
                        }
                        console.log("start parsing");
                        update("Logging in...", "In game | Login screen", Date.now());
                        const options = {
                            interval: 500,
                            startAtEnd: true
                        };
                        tail = new Tail(logFolder + logs[0].name, /\n{1,4}\r\n/, options);
                        tail.on("line", function (data) {
                            parse(data);
                        });
                    });
                }
            } else if (status === false) {
                console.log("stopped");
                tail.unwatch();
                tail = undefined;
                if (userCountUpdater !== undefined) {
                    clearInterval(userCountUpdater)
                }
            }
        });
    }, 10000);
};

const disableParser = () => {
    if (parserEnabled === false) {
        return;
    }
    parserEnabled = false;
    tail.unwatch();
    tail = undefined;
    console.log("stopped");
    clearInterval(vrchatCheck);
};

const enableDiscord = () => {
    if (discordEnabled === true) {
        return;
    }
    discordEnabled = true;
    client = require('discord-rich-presence')('551621567948390401');
    console.log("mood");
    update("In VRCApiary", "Not in game", undefined);
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

/**
 * @deprecated just don't...
 */
const start = () => {
    isVRChatRunning('vrchat.exe', (status) => {
        if (status === true) {

        } else {

        }
    });
    status = "In VRCApiary";
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

let lastUpdate = {};

const update = (state, details, time, users, usersMax) => {
    if (discordEnabled === false) {
        return;
    }
    const i = {
        state: state,
        details: details,
        largeImageKey: 'logo',
        largeImageText: 'VRCApiary ' + app.getVersion()
    };
    if (time !== undefined) {
        i.startTimestamp = time;
    }

    if (users !== undefined && usersMax !== undefined ) {
        i.partySize = users;
        i.partyMax = usersMax;
        i.partyId = Buffer.from(details).toString('base64')
    }
    if (JSON.stringify(lastUpdate) === JSON.stringify(i)) {
        return;
    }
    client.updatePresence(i);
    lastUpdate = i;
};

const parse = (line) => {

    parseWithRegex(line, "[RoomManager] Joining wrld", /^.+ - {2}\[RoomManager] Joining (.+)/, (match) => {
        const regex = /(.+?):(.+?)($|~((.+?)\(.+))$/;
        const match1 = regex.exec(match[1]);
        if (match1 !== undefined && match1.length !== 0) {
            if (match1.length >= 5) {
                switch (match1[5]) {
                    case "hidden": {
                        type = "Friends+";
                        break;
                    }
                    case "friends": {
                        type = "Friends";
                        break;
                    }
                    case "private": {
                        type = "Private";
                        break;
                    }
                    default: {
                        type = "Public";
                        break;
                    }
                }
            }
        }
    });


    parseWithRegex(line, "[RoomManager] Joining or Creating Room:", /^.+ - {2}\[RoomManager] Joining or Creating Room: (.+)/, (match) => {
        users = 0;
        world = match[1];
        if (world.length > 18) {
            world = world.substring(0, 15) + "...";
        }
        status = "In a world";
        if (userCountUpdater !== undefined) {
            clearInterval(userCountUpdater);
        }
        userCountUpdater = setInterval(() => {
            update("In a world", world + " | " + type, date, users, 24);
        }, 30000);
        date = Date.now();
        update("In a world", world + " | " + type, date);
    });

    parseWithRegex(line, "[NetworkManager] OnPlayerJoined", /^.+ - {2}\[NetworkManager] OnPlayerJoined (.+)/, (match) => {
        users++;
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
        users--;
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
        update("In VRCApiary", "Not in game", undefined);
        tail.unwatch();
        console.log("stopped");
        tail = undefined;
        if (userCountUpdater !== undefined) {
            clearInterval(userCountUpdater)
        }
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