const {remote} = require('electron');
const storage = remote.require('./storage.js');

console.log(storage);
document.getElementById("get-button").addEventListener('click', () => {
    sendGETRequest("/config", (data) => {
        if (data['apiKey'] !== undefined) {
            alert('API key is: ' + data['apiKey']);
            storage.setApiKey(data['apiKey']);
            document.location = "login.html"
        } else {
            alert("API key unavailable");
        }
    });
});
