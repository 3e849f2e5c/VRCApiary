document.getElementById("login-button").addEventListener('click', () => {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("checkbox").checked;
    if (username === "" || password === "" || username.indexOf(":") !== -1) {
        alert("Invalid username or password");
        blinkRed();
        return;
    }
    load();
    sendGETRequest("/auth/user", (data) => {
        if (data.error !== undefined) {
            blinkRed();
            alert(data.error.message)
        } else {
            stopLoading();
            blinkGreen();
        }
        stopLoading();
    }, username + ':' + password);
});
