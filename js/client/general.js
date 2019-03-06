let isMenuUp = false;

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

const navToPage = (page) => {
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
                document.location = "./friends.html";
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
        case " ": {
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

window.onkeydown = (e) => {
    return !(e.key === ' ');
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

setTimeout(() => {
    getId("content").style.opacity = "1";
}, 300);
setTimeout(() => {
    getId("loadingIcon").style.opacity = "0";
}, 100);
