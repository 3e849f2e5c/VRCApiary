const baseUrl = "https://api.vrchat.cloud/api/1";

/**
 * Parse auth token from HTTP cookies
 * @param headers   The HTTP request headers
 * @return {string} The authorization key
 */
function getAuthKey(headers) {
    const list = {};
    const rc = headers['set-cookie'][1];

    if (rc.length < 1) {
        return undefined
    }

    rc && rc.split(';').forEach(function (cookie) {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

/**
 * Send a HTTP GET request to the target URL
 * @param {string} location         Target URL
 * @param {function} callback       Callback function
 * @param {string} [basic]          Basic auth if required
 */
function sendGETRequest(location, callback, basic) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            const data = JSON.parse(xmlHttp.responseText);
            callback(data);
            console.log("Request received");
            console.log(data);
        }
    };
    console.log("Request sent");
    xmlHttp.open("GET", baseUrl + location, true);
    if (basic !== undefined) {
        xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(basic));
    }
    xmlHttp.send(null);
}