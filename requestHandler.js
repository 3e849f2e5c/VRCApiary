const api = require("./js/client/vrchat-api.js");

function login(username, password, rememberMe, callback) {
    api.generateAuthToken(username + password, (resp) => {
        if (resp.error !== undefined) {
            callback(resp.error);
        } else {
            callback(undefined);
        }
    })
}

module.exports = {
  login: login
};