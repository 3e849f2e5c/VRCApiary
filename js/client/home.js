const userData = JSON.parse(localStorage.getItem("userData"));

getId("moderationsButton").addEventListener("click", () => {
    navToPage("mods");
});
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

let trust_level = tagsToTrustRank(tags);

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

/**
 * Load notifications
 */
const renderNotifications = (data) => {
    const area = getId("notifyArea");
    for (let i = 0; i < data.length; i++) {
        const notify = data[i];
        const notifyContainer = createElement("div", "notify-container");
        const notifyIcon = createElement("img", "notify-icon");
        notifyContainer.appendChild(notifyIcon);
        notifyIcon.src = "../css/images/notifications/friendrequest.png";
        switch (notify.type.toLowerCase()) {
            case "friendrequest":
                notifyIcon.title = "Friend request from " + notify.senderUsername;
                notifyIcon.src = "../css/images/notifications/friendrequest.png";
                break;
            case "invite":
                notifyIcon.title = "Invite from " + notify.senderUsername;
                notifyIcon.src = "../css/images/notifications/invite.png";
                break;
            case "requestinvite":
                notifyIcon.title = "Invite request from " + notify.senderUsername;
                notifyIcon.src = "../css/images/notifications/requestinvite.png";
                break;
            case "message":
                notifyIcon.title = "Message from " + notify.senderUsername;
                notifyIcon.src = "../css/images/notifications/message.png";
                break;
            default:
                notifyIcon.title = "[Unknown] from  " + notify.senderUsername;
                notifyIcon.src = "../css/images/notifications/friendrequest.png";
        }

        notifyIcon.addEventListener("click", () => {
            openNotification(notify, notifyContainer);
        });
        area.appendChild(notifyContainer);
    }
    finishLoading();
};

const openNotification = (data, element) => {
    const popupMenu = getId("popupMenu");
    const popup = getId("notifyPopup");
    const body = getId("content");
    popup.innerHTML = '';
    const div = createElement("div", "popup-container");
    const header = createElement("a", "header", "Unknown");
    const buttonsContainer = createElement("div", "popup-buttons-container");
    const messageContainer = createElement("div", "popup-message-container");
    const message = createElement("textarea", "popup-message");
    const endings = ["Sincerely, ", "Yours truly, ", "Best regards, ", "Best wishes, ", "Regards, ", "XOXO, ", "Love, "];
    const randomEnding = endings[Math.floor(Math.random() * endings.length)];
    message.readOnly = true;
    let details = JSON.parse(data.details);
    switch (data.type.toLowerCase()) {
        case "friendrequest":
            header.innerText = "Friend request";
            message.innerHTML = "Dear " + userData.displayName + ".\nI would like to be your friend.\n" + randomEnding + "\n    - " + data.senderUsername;
            buttonsContainer.appendChild(createButton("Accept", "button-green", (e) => {
                load();
                disableDiv(e.srcElement);
                acceptFriendsRequest(data.id, (resp) => {
                    if (resp.error === undefined) {
                        getId("notifyArea").removeChild(element);
                        setTimeout(() => {
                            popupMenu.style.visibility = "hidden";
                            if (body !== null) {
                                body.style.filter = "none";
                            }
                        }, 100);
                        stopLoading();
                        blinkGreen();
                    } else {
                        enableDiv(e.srcElement);
                        sendNotification("Error", resp.error.message, getIconFor("error"));
                        stopLoading();
                        blinkRed();
                    }
                })
            }));
            break;
        case "invite":
            header.innerText = "Invite";
            message.innerHTML = "Dear " + userData.displayName + ".\nJoin me in " + details.worldName + ".\n" + randomEnding + "\n    - " + data.senderUsername;
            buttonsContainer.appendChild(createButton("Join", "button-blue", () => {
                document.location = "vrchat://launch?id=" + details.worldId;
            }));
            break;
        case "requestinvite":
            header.innerText = "Invite request";
            message.innerHTML = "Dear " + userData.displayName + ".\nPlease invite me to your world.\n" + randomEnding + "\n    - " + data.senderUsername;
            buttonsContainer.appendChild(createButton("Invite", "button-blue disabled", () => {

            }));
            break;
        case "message":
            header.innerText = "Message";
            message.innerHTML = "Dear " + userData.displayName + ".\n" + data.message + "\n" + randomEnding + "\n    - " + data.senderUsername;
            break;
    }

    console.log(data);
    buttonsContainer.appendChild(createButton("Hide", "button-green", (e) => {
        load();
        disableDiv(e.srcElement);
        deleteNotification(data.id, (resp) => {
            enableDiv(e.srcElement);
            if (resp.error === undefined) {
                getId("notifyArea").removeChild(element);
                setTimeout(() => {
                    popupMenu.style.visibility = "hidden";
                    if (body !== null) {
                        body.style.filter = "none";
                    }
                }, 100);
                stopLoading();
                blinkGreen();
            } else {
                sendNotification("Error", resp.error.message, getIconFor("error"));
                stopLoading();
                blinkRed();
            }
        })
    }));
    buttonsContainer.appendChild(createButton("Cancel", "button-red", () => {
        setTimeout(() => {
            popupMenu.style.visibility = "hidden";
            if (body !== null) {
                body.style.filter = "none";
            }
        }, 100);
    }));
    div.appendChild(header);
    messageContainer.appendChild(message);
    div.appendChild(messageContainer);
    div.appendChild(buttonsContainer);
    popup.appendChild(div);
    setTimeout(() => {
        if (body !== null) {
            body.style.filter = "blur(4px)";
        }
        popupMenu.style.visibility = "visible";
        setTimeout(() => {
            popupMenu.style.opacity = "1";
        }, 0);
    }, 100);
};

getNotifications((data) => {
    renderNotifications(data);
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
