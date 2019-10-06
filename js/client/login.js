const {remote} = require('electron');
const main = require('electron');
const storage = remote.require('./storage.js');
const websocket = remote.require('./websocketHandler.js');

storage.getCredentials((username, password) => {
    const rememberMe = document.getElementById("checkbox");
    const fieldUsername = document.getElementById("username");
    const fieldPassword = document.getElementById("password");
    if (username !== null) {
        rememberMe.checked = true;
        fieldUsername.value = username;
        fieldPassword.value = password;
    }
});

document.getElementById("login-button").addEventListener('click', (e) => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("checkbox").checked;

    if (username === "" || password === "" || username.indexOf(":") !== -1) {
        sendError({error:{message:"Invalid username or password"}}, "VRCApiary");
        blinkRed();
        return;
    }
    load();
    disableDiv(e.srcElement);
    sendGETRequest("/auth", (data) => {
        if (data.error !== undefined) {
            blinkRed();
            sendError(data, "VRChat API");
            enableDiv(e.srcElement);
        } else if (data.ok === true) {
            if (rememberMe === true) {
                storage.saveCredentials(username, password);
            }
            sendGETRequest("/auth/user/", (dataE) => {
                if (dataE.error !== undefined) {
                    stopLoading();
                    blinkRed();
                    sendError(dataE, "VRChat API");
                    enableDiv(e.srcElement);
                } else {
                    console.log(data);
                    websocket.startWebsocket(data.token);
                    window.localStorage.setItem("userData", JSON.stringify(dataE));
                    document.getElementById("content").style.transform = "translateX(-100%)";
                    setTimeout(() => {
                        window.location = "home.html";
                    }, 300);
                    stopLoading();
                    blinkGreen();
                }
            });
        }
        stopLoading();
    }, username + ':' + password);
});
finishLoading();