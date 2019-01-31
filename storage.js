const {session} = require('electron');
const storage = require('electron-json-storage');

function setApiKey(token) {
    const cookie = {url: 'https://api.vrchat.cloud/', name: 'apiKey', value: token};
    session.defaultSession.cookies.set(cookie, (error) => {
        if (error) {
            throw error
        }
    });

    storage.set('login', { apiKey: token }, function(error) {
        if (error) throw error;
    });
}

module.exports = {
  setApiKey: (token) => {
      setApiKey(token);
  }
};