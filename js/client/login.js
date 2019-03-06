const {remote} = require('electron');
const storage = remote.require('./storage.js');

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


const localStorage = window.localStorage;
if (localStorage.getItem("requests") === null) {
    localStorage.setItem("requests", "0");
}
if (localStorage.getItem("failedRequests") === null) {
    localStorage.setItem("failedRequests", "0");
}

console.log(localStorage.getItem("test"));

document.getElementById("login-button").addEventListener('click', () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("checkbox").checked;

    if (username === "" || password === "" || username.indexOf(":") !== -1) {
        sendNotification("Login Error", "Invalid username or password");
        blinkRed();
        return;
    }
    load();
    sendGETRequest("/auth/user", (data) => {
        if (data.error !== undefined) {
            blinkRed();
            sendNotification("Login Error", data.error.message);
        } else {
            if (rememberMe === true) {
                storage.saveCredentials(username, password);
            }
            sendNotification("Login Successful", "Welcome " + data.displayName, getIconFor("ok"));
            stopLoading();
            blinkGreen();
            console.log(data);
            window.localStorage.setItem("userData", JSON.stringify(data));
            document.getElementById("content").style.transform = "translateX(-100%)";
            pageLoad();
            setTimeout(() => {
                window.location = "home.html";
            }, 300);

            sendNotification("Press Esc to begin navigation",
                "Click here to never see this notification again",
                getIconFor("info"),
                () => {
            });
        }
        stopLoading();
    }, username + ':' + password);
});