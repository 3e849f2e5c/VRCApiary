const mine = getId("mine");
const mineButton = getId("mineButton");
getId("mineButton").addEventListener("click", () => {
    const users = {};
    disableDiv(mineButton);
    load();
    getPlayermods((data) => {
        stopLoading();
        if (data.error !== undefined) {
            enableDiv(againstButton);
            blinkRed();
            sendNotification("Error", data.error.message, getIconFor("error"));
        }
        mineButton.parentNode.parentNode.removeChild(mineButton.parentNode);
        blinkGreen();
        for (let i = 0; i < data.length; i++) {
            const mod = data[i];
            const name = mod.targetDisplayName;
            if (users[name] === undefined) {
                users[name] = {
                    mute: false,
                    block: false,
                    avatar: false,
                    timestamp: mod.created
                };
            }
            switch (mod.type) {
                case 'block':
                    users[name].block = true;
                    break;
                case 'unmute':
                    users[name].mute = false;
                    break;
                case 'mute':
                    users[name].mute = true;
                    break;
                case 'hideAvatar':
                    users[name].avatar = true;
                    break;
                case 'showAvatar':
                    users[name].avatar = false;
                    break;
            }
        }
        const usersSorted = [];
        for (let key in users) {
            if (users.hasOwnProperty(key)) {
                const usr = users[key];
                if (!(usr.mute === false && usr.block === false && usr.avatar === false)) {
                    usersSorted.push({
                        name: key,
                        mute: usr.mute,
                        block: usr.block,
                        avatar: usr.avatar,
                        timestamp: usr.timestamp
                    })
                }
            }
        }
        for (let j = 0; j < usersSorted.length; j++) {
            const user = usersSorted[j];
            mine.appendChild(createEntry(user));
        }
    });
});

const against = getId("against");
const againstButton = getId("againstButton");
againstButton.addEventListener("click", () => {
    const users = {};
    load();
    disableDiv(againstButton);
    getPlayermodsAgainst((data) => {
        stopLoading();
        if (data.error !== undefined) {
            enableDiv(againstButton);
            blinkRed();
            sendNotification("Error", data.error.message, getIconFor("error"));
        }
        againstButton.parentNode.parentNode.removeChild(againstButton.parentNode);
        blinkGreen();
        for (let i = 0; i < data.length; i++) {
            const mod = data[i];
            const name = mod.sourceDisplayName;
            if (users[name] === undefined) {
                users[name] = {
                    mute: false,
                    block: false,
                    avatar: false,
                    timestamp: mod.created
                };
            }
            switch (mod.type) {
                case 'block':
                    users[name].block = true;
                    break;
                case 'unmute':
                    users[name].mute = false;
                    break;
                case 'mute':
                    users[name].mute = true;
                    break;
                case 'hideAvatar':
                    users[name].avatar = true;
                    break;
                case 'showAvatar':
                    users[name].avatar = false;
                    break;
            }
        }
        const usersSorted = [];
        for (let key in users) {
            if (users.hasOwnProperty(key)) {
                const usr = users[key];
                if (!(usr.mute === false && usr.block === false && usr.avatar === false)) {
                    usersSorted.push({
                        name: key,
                        mute: usr.mute,
                        block: usr.block,
                        avatar: usr.avatar,
                        timestamp: usr.timestamp
                    })
                }
            }
        }
        for (let j = 0; j < usersSorted.length; j++) {
            const user = usersSorted[j];
            against.appendChild(createEntry(user));
        }
    });
});

const createEntry = (data) => {
    const div = createElement("div", "user-list-entry");
    const a = createElement("a");
    const icons = createElement("div", "icons-container");
    a.innerText = data.name;
    const d = new Date(data.timestamp);
    a.title = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
    div.appendChild(a);
    div.appendChild(icons);
    if (data.block === true) {
        const img = createElement("img", "");
        img.src = "../css/images/moderation/blocked.png";
        img.title = "Blocked";
        icons.appendChild(img);
    }

    if (data.avatar === true) {
        const img = createElement("img", "");
        img.src = "../css/images/moderation/avatar.png";
        img.title = "Avatar hidden";
        icons.appendChild(img);
    }

    if (data.mute === true) {
        const img = createElement("img", "");
        img.src = "../css/images/moderation/muted.png";
        img.title = "Muted";
        icons.appendChild(img);
    }
    return div;
};

finishLoading();