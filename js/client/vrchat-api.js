const baseUrl = "https://api.vrchat.cloud/api/1";


/**
 * Get VRChat friends list
 * https://vrchatapi.github.io/#/UserAPI/Friends
 * @param callback  Callback function
 */
const getFriends = (callback) => {
    sendGETRequest("/auth/user/friends", (data) => {
        callback(data);
    });
};

/**
 * Get a VRChat world instance by ID and tags
 * https://vrchatapi.github.io/#/WorldAPI/WorldInstanceTags
 * @param worldId   ID of the world
 * @param otherId   Instance tags
 * @param callback  Callback function
 */
const getWorldInstance = (worldId, otherId, callback) => {
    sendGETRequest("/worlds/" + worldId + "/" + otherId, (data) => {
        callback(data);
    });
};

/**
 * Get a VRChat world by ID
 * https://vrchatapi.github.io/#/WorldAPI/GetWorld
 * @param worldId   ID of the world
 * @param callback  Callback function
 */
const getWorld = (worldId, callback) => {
    sendGETRequest("/worlds/" + worldId, (data) => {
        callback(data);
    });
};

/**
 * Get cached VRChat world name
 * @param worldId   ID of the world
 * @param callback  Callback function
 */
const getWorldNameCached = (worldId, callback) => {
    const localStorage = window.localStorage;
    const json = JSON.parse(localStorage.getItem("worldNames"));
    if (json[worldId] === undefined || json[worldId] === null) {
        callback(null);
    } else {
        callback(json[worldId].name);
    }
};

/**
 * Send a HTTP GET request to the target URL
 * @param {string} location         Target URL
 * @param {function} callback       Callback function
 * @param {string} [basic]          Basic auth if required
 */
const sendGETRequest = (location, callback, basic) => {
    const localStorage = window.localStorage;
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status.toString().lastIndexOf("4", 0) === 0) {
                localStorage.setItem("failedRequests", (parseInt(localStorage.getItem("failedRequests")) + 1).toString())
            }
            const data = JSON.parse(xmlHttp.responseText);
            callback(data);
            console.log("Request received");
            console.log(data);
        }
    };
    console.log("Request sent");
    sendNotification("Request sent", "a HTTP GET request was sent", getIconFor("debug"));
    xmlHttp.open("GET", baseUrl + location, true);
    if (basic !== undefined) {
        xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(basic));
    }
    localStorage.setItem("requests", (parseInt(localStorage.getItem("requests")) + 1).toString());
    xmlHttp.send(null);
};