let isMenuUp = false;

if (localStorage.getItem("worldNames") === null) {
    localStorage.setItem("worldNames", "{}");
}

const sendNotification = (title, body, image, callback) => {
    const options = {
        body: body
    };
    if (image !== undefined) {
        options.icon = image;
    }
    let notify = new Notification(title, options);
    notify.onclick = callback;
};

// TODO proper icons and copyright
const getIconFor = (name) => {
    switch (name) {
        case "info":
            return "https://i.imgur.com/YFPOhDF.png";
        case "debug":
            return "https://i.imgur.com/vdhVjqM.png";
        case "ok":
            return "https://i.imgur.com/mX6fF8K.png";
        default:
            return;
    }
};

// TODO logging
const println = (message) => {
    console.log(message);
};

const getId = (id) => {
    return document.getElementById(id);
};

const pageLoad = () => {
    getId("content").style.opacity = "0";
    getId("loadingIcon").style.opacity = "1";
};

const navToPage = (page, flag) => {
    const menu = getId("navMenu");
    const content = getId("content");
    if (menu !== null && isMenuUp === true) {
        menu.style.opacity = "0";
        setTimeout(() => {
            menu.style.visibility = "hidden";
            if (content !== null) {
                content.style.filter = "none";
            }
        }, 300);
        isMenuUp = false;
    }
    switch (page) {
        case "home": {
            pageLoad();
            setTimeout(() => {
                document.location = "./home.html";
            }, 300);
            break;
        }

        case "friends": {
            pageLoad();
            setTimeout(() => {
                let destination = "./friends.html";
                if (flag !== undefined) {
                    destination += flag;
                }
                document.location = destination;
            }, 300);
            break;
        }
    }
};

if (getId("navMenu") !== null) {
    getId("navHome").addEventListener('click', () => {
        navToPage("home");
    });

    getId("navFriends").addEventListener('click', () => {
        navToPage("friends");
    });
}

document.addEventListener('keyup', (e) => {
    const menu = getId("navMenu");
    const content = getId("content");
    if (menu === undefined) {
        return;
    }
    switch (e.key) {
        case "Escape": {
            if (isMenuUp === false) {
                menu.style.visibility = "visible";
                setTimeout(() => {
                    menu.style.opacity = "1";
                    if (content !== null) {
                        content.style.filter = "blur(4px)";
                    }
                });
                isMenuUp = true;
            } else {
                menu.style.opacity = "0";
                setTimeout(() => {
                    menu.style.visibility = "hidden";
                    if (content !== null) {
                        content.style.filter = "none";
                    }
                }, 100);
                isMenuUp = false;
            }
            break;
        }
        case "F1": {
            navToPage("home");
            break;
        }
        case "F2": {
            navToPage("friends");
            break;
        }
    }
});

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

const tagsToTrustRank = (tags) => {
    let trust_level = 0;
    if (tags !== undefined) {
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
    return trust_level;
};

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
        default: return "white";
    }
};

const getParameterByName = (name, url) => {
    if (!url) url = window.location.href; name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const finishLoading = () => {
    setTimeout(() => {
        getId("content").style.opacity = "1";
    }, 300);
    setTimeout(() => {
        getId("loadingIcon").style.opacity = "0";
    }, 100);
};
