const {session} = require('electron');
const storage = require('electron-json-storage');

const setApiKey = (token) => {
    const cookie = {url: 'https://api.vrchat.cloud/', name: 'apiKey', value: token};
    session.defaultSession.cookies.set(cookie, (error) => {
        if (error) {
            throw error
        }
    });

    storage.set('login', {apiKey: token}, function (error) {
        if (error) throw error;
    });
};

const getCredentials = (callback) => {
    storage.has("credentials", (error, hasKey) => {
        if (hasKey === true) {
            storage.get("credentials", (error, data) => {
                if (data.username !== undefined && data.password !== undefined) {
                    callback(data.username, data.password);
                } else {
                    callback(null);
                }
            });
        }
    });
};

// TODO DONT STORE PLAINTEXT PASSWORDS YOU MONGLET!!!`
const saveCredentials = (username, password) => {
    storage.set('credentials', {username: username, password: password}, function (error) {
        if (error) console.log(error);
    });
};

module.exports = {
    setApiKey: (token) => {
        setApiKey(token);
    },
    saveCredentials: (username, password) => {
        saveCredentials(username, password);
    },
    getCredentials: (callback) => {
        getCredentials(callback)
    }
};