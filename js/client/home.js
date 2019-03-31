const userData = JSON.parse(localStorage.getItem("userData"));

getId("user-name").innerText = userData.username;
getId("display-name").innerText = userData.displayName;
getId("user-id").innerText = userData.id;
getId("avatar-image").src = userData.currentAvatarThumbnailImageUrl;
getId("status").value = userData.statusDescription;

switch (userData.status) {
    case "active": {
        getId("avatar-image").setAttribute("style", "border-color: green;");
        break;
    }
    case "join me": {
        getId("avatar-image").setAttribute("style", "border-color: aqua;");
        break;
    }
    case "busy": {
        getId("avatar-image").setAttribute("style", "border-color: red;");
        break;
    }
}

const tags = userData.tags;

let trust_level = 0;

if (tags === undefined) {
    trust_level = 0;
} else {
    // Nuisance
    trust_level = tags.indexOf("system_troll") > -1 ? -2 :
        // Troll
        trust_level = tags.indexOf("system_probable_troll") > -1 ? -1 :
            // Veteran a.k.a Legend
            trust_level = tags.indexOf("system_trust_legend") > -1 ? 5 :
                // Trusted
                trust_level = tags.indexOf("system_trust_veteran") > -1 ? 4 :
                    // Known
                    trust_level = tags.indexOf("system_trust_trusted") > -1 ? 3 :
                        // User
                        trust_level = tags.indexOf("system_trust_known") > -1 ? 2 :
                            // Visitor
                            trust_level = tags.indexOf("system_trust_basic") > -1 ? 1 : 0;
}

const trustMeterShrinker = getId("trustBarShrink");
const trustBar = getId("trustBar");
const trustImage = getId("trustImage");
const trustInfo = getId("trustInfo");


switch (trust_level) {
    case -2: {
        trustMeterShrinker.style.width = "100%";
        trustImage.setAttribute("src", "../css/images/trust/0.png");
        trustInfo.innerText = "Nuisance";
        trustMeterShrinker.style.width = "0";
        trustBar.style.backgroundColor = "#ff2328";
        break;
    }
    case -1: {
        trustMeterShrinker.style.width = "50%";
        trustImage.setAttribute("src", "../css/images/trust/1.png");
        trustInfo.innerText = "Troll";
        trustBar.style.backgroundColor = "#ff2328";
        break;
    }
    case 0: {
        trustMeterShrinker.style.width = "83%";
        trustImage.setAttribute("src", "../css/images/trust/2.png");
        trustInfo.innerText = "Visitor";
        trustBar.style.backgroundColor = "#cccccc";
        break;
    }
    case 1: {
        trustMeterShrinker.style.width = "66.4%";
        trustImage.setAttribute("src", "../css/images/trust/3.png");
        trustInfo.innerText = "New User";
        trustBar.style.backgroundColor = "#1778ff";
        break;
    }
    case 2: {
        trustMeterShrinker.style.width = "49.8%";
        trustImage.setAttribute("src", "../css/images/trust/4.png");
        trustInfo.innerText = "User";
        trustBar.style.backgroundColor = "#2bcf5c";
        break;
    }
    case 3: {
        trustMeterShrinker.style.width = "33.2%";
        trustInfo.innerText = "Known User";
        trustImage.setAttribute("src", "../css/images/trust/5.png");
        trustBar.style.backgroundColor = "#ff7b42";
        break;
    }
    case 4: {
        trustMeterShrinker.style.width = "16.6%";
        trustInfo.innerText = "Trusted User";
        trustImage.setAttribute("src", "../css/images/trust/6.png");
        trustBar.style.backgroundColor = "#8143e6";
        break;
    }
    case 5: {
        trustMeterShrinker.style.width = "0";
        trustInfo.innerText = "Veteran";
        trustImage.setAttribute("src", "../css/images/trust/7.png");
        trustBar.style.backgroundColor = "#ffff00";
        break;
    }
}

const newEntry = (text) => {
    const e = document.createElement('a');
    e.innerText = text;
    return e;
};

/**
 * Load notifications
 */
getNotifications((data) => {
    const area = getId("notifyArea");
    for (let i = 0; i < data.length; i++) {
        const notify = data[i];
        const notifyContainer = createElement("div", "notify-container");
        const notifyIcon = createElement("img", "notify-icon");
        notifyContainer.appendChild(notifyIcon);
        notifyIcon.src = "../css/images/notifications/friendrequest.png";
        switch (notify.type) {
            case "friendrequest":
                notifyIcon.src = "../css/images/notifications/friendrequest.png";
                break;
            case "invite":
                notifyIcon.src = "../css/images/notifications/invite.png";
                break;
            case "requestinvite":
                notifyIcon.src = "../css/images/notifications/requestinvite.png";
                break;
            case "message":
                notifyIcon.src = "../css/images/notifications/message.png";
                break;
            default:
                notifyIcon.src = "../css/images/notifications/friendrequest.png";
        }
        area.appendChild(notifyContainer);
    }
    finishLoading();
});

if (localStorage.getItem("neverSee") === null) {
    sendNotification("Press Esc to begin navigation",
        "Click here to never see this notification again",
        getIconFor("info"),
        () => {
            localStorage.setItem("neverSee", "1");
        }
    );
}
