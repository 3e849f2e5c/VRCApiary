const {remote} = require('electron');

const downloadFile = (url) => {
    remote.require('./main.js').download(url);
};