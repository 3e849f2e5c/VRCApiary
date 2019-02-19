const {remote} = require('electron');
const storage = remote.require('./storage.js');

const button = document.getElementById("get-button");
button.addEventListener('click', () => {
    button.innerText = "Working...";
    button.disabled = true;
    sendGETRequest("/config", (data) => {
        if (data['apiKey'] !== undefined) {
            alert('API key is: ' + data['apiKey']);
            storage.setApiKey(data['apiKey']);
            document.location = "login.html?message=mood"
        } else {
            alert("API key unavailable");
            button.disabled = false;
            button.innerText = "Try again";
        }
    });
});
