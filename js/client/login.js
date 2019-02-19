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
            sendNotification("Login Successful", "Welcome " + data.displayName, getIconFor("ok"));
            stopLoading();
            blinkGreen();
            console.log(data);
            window.location = "home.html"
        }
        stopLoading();
    }, username + ':' + password);
});
