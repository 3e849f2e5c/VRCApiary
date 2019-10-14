const main = require('electron');

const getId = (id) => {
    return document.getElementById(id);
};

const getE = (e, callback) => {
    callback(fakeJson);
};

/**
 * Convert user tags to trust rank value
 * @param tags          User tags
 * @returns {number}    -2 to 5
 */
const tagsToTrustRank = (tags) => {
    let trust_level = 0;
    if (tags !== undefined) {
        // Nuisance
        // noinspection JSUnusedAssignment :: This thing is so spaghetti it breaks IntelliJ IDEA...
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
    return trust_level;
};

/**
 * Trust rank value to a CSS color value
 * @param rank          Value -2 to 5
 * @returns {string}    Color
 */
const trustRankToColor = (rank) => {
    switch (rank) {
        case -2:
            return "#ff2328";
        case -1:
            return "#ff2328";
        case 0:
            return "#cccccc";
        case 1:
            return "#1778ff";
        case 2:
            return "#2bcf5c";
        case 3:
            return "#ff7b42";
        case 4:
            return "#8143e6";
        case 5:
            return "#ffff00";
        default:
            return "white";
    }
};

const createElement = (type, css, innerText) => {
    const e = document.createElement(type);
    if (css !== undefined) {
        e.setAttribute("class", css);
    }
    if (innerText !== undefined) {
        e.innerText = innerText;
    }
    return e;
};

const createCardForFriend = (data) => {
    const container = createElement("div", "box friend-container-t");
    const image = createElement("img", "friend-image-t");
    image.src = data.currentAvatarThumbnailImageUrl;
    const textContainer = createElement("div", "text-container-t");
    const name = createElement("a", "friend-name-t", data.displayName);
    const statusDesc = createElement("p", "friend-status-t", data.statusDescription);
    textContainer.appendChild(name);
    textContainer.appendChild(statusDesc);

    let status;
    switch (data.status) {
        case "active":
            status = "green";
            break;
        case "join me":
            status = "aqua";
            break;
        case "busy":
            status = "red";
            break;
        default:
            status = "white";
    }
    image.setAttribute("style", "border-color: " + status);
    name.setAttribute("style", "color: " + trustRankToColor(tagsToTrustRank(data.tags)));
    container.appendChild(image);
    container.appendChild(textContainer);
    return container;
};

getE(undefined, (data) => {
    if (data !== undefined && typeof data === "object") {
        for (let i = 0; i < data.length; i++) {
            getId("friendsList").appendChild(createCardForFriend(data[i]));
        }
    }
});

main.ipcRenderer.on('friend-online', (event, message) => {
    getId("friendsList").appendChild(createCardForFriend(message.user));
});


