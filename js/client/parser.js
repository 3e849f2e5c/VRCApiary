if (isVRChatConnected() === true) {
    getId('vrchatStatus').innerText = "Connected";
    getId('vrchatStatus').style.color = "green";
} else {
    getId('vrchatStatus').innerText = "Disconnected";
    getId('vrchatStatus').style.color = "red";
}

if (isIceCreamConnected() === true) {
    getId('status').innerText = "Connected";
    getId('status').style.color = "green";
} else {
    getId('status').innerText = "Disconnected";
    getId('status').style.color = "red";
}

const getItem = (e) => {
    return JSON.parse(window.localStorage.getItem(e));
};

const setItem = (e, i) => {
    window.localStorage.setItem(e, JSON.stringify(i));
};

if (getItem("parserSettings").enableParser === true) {
    getId("checkboxParser").checked = true;
}

getId("checkboxParser").addEventListener('change', (event) => {
    const newSetting = getItem("parserSettings");
    newSetting.enableParser = event.target.checked;
    setItem("parserSettings", newSetting);
    if (event.target.checked === true) {
        parser.enableParser();
    } else {
        parser.disableParser();
    }
});

if (getItem("parserSettings").enableDiscord === true) {
    getId("checkboxDiscord").checked = true;
}

getId("checkboxDiscord").addEventListener('change', (event) => {
    const newSetting = getItem("parserSettings");
    newSetting.enableDiscord = event.target.checked;
    setItem("parserSettings", newSetting);
    if (event.target.checked === true) {
        parser.enableDiscord();
    } else {
        parser.disableDiscord();
    }
});

if (getItem("parserSettings").enableNotifications === true) {
    getId("checkboxNotify").checked = true;
}

getId("checkboxNotify").addEventListener('change', (event) => {
    const newSetting = getItem("parserSettings");
    newSetting.enableNotifications = event.target.checked;
    setItem("parserSettings", newSetting);
    if (event.target.checked === true) {
        parser.enableNotifications();
    } else {
        parser.disableNotifications();
    }
});

finishLoading();