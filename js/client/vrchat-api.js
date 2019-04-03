/**
 * Base API URL
 * @type {string}
 */
const baseUrl = "https://api.vrchat.cloud/api/1";

/**
 * Get user by ID
 * @param userId        User ID
 * @param callback      Callback function
 */
const getUser = (userId, callback) => {
    sendGETRequest("/users/" + userId, (data) => {
        callback(data);
    });
};

/**
 * Send a message to user
 * https://vrchatapi.github.io/#/NotificationAPI/SendNotification
 * @param userId        Receiver user ID
 * @param msg           Message to send
 * @param callback      Callback function
 */
const sendMessage = (userId, msg, callback) => {
    sendPOSTRequest("/user/" + userId + "/message", {
        type: "message",
        message: msg
    }, (data) => {
        callback(data);
    })
};

/**
 * Edit an avatar
 * https://vrchatapi.github.io/#/AvatarAPI/SaveAvatar
 * @param avatar        Avatar ID
 * @param update        Update data
 * @param callback      Callback function
 */
const editAvatar = (avatar, update, callback) => {
    sendPUTRequest("/avatars/" + avatar, update, (data) => {
        callback(data);
    });
};

/**
 * Delete an avatar
 * https://vrchatapi.github.io/#/AvatarAPI/GetByID
 * @param avatar        Avatar ID
 * @param callback      Callback function
 */
const deleteAvatar = (avatar, callback) => {
    sendDELETERequest("/avatars/" + avatar, (data) => {
        callback(data);
    });
};

/**
 * Get avatar by ID
 * https://vrchatapi.github.io/#/AvatarAPI/GetByID
 * @param avatar        Avatar ID
 * @param callback      Callback function
 */
const getAvatar = (avatar, callback) => {
    sendGETRequest("/avatars/" + avatar, (data) => {
        callback(data);
    });
};

/**
 * Change avatar to a specified avatar ID
 * https://vrchatapi.github.io/#/AvatarAPI/ChooseAvatar
 * @param avatarId      Avatar ID
 * @param callback      Callback function
 */
const changeAvatar = (avatarId, callback) => {
    sendPUTRequest("/avatars/" + avatarId + "/select", {}, (data) => {
        callback(data);
    });
};

/**
 * Add world, friend or avatar to favorites
 * https://vrchatapi.github.io/#/FavoritesAPI/AddFavorite
 * @param id            Object ID
 * @param type          Favorite type
 * @param tags          Favorite tags
 * @param callback      Callback function
 */
const addFavorite = (id, type, tags, callback) => {
    sendPOSTRequest("/favorites", {
        favoriteId: id,
        type: type,
        tags: tags
    }, (data) => {
        callback(data);
    })
};

/**
 * Remove a favorite
 * https://vrchatapi.github.io/#/FavoritesAPI/DeleteFavorite
 * @param id            Favorite ID
 * @param callback      Callback function
 */
const removeFavorite = (id, callback) => {
    sendDELETERequest("/favorites/" + id, (data) => {
        callback(data);
    })
};

/**
 * List avatars with options
 * https://vrchatapi.github.io/#/AvatarAPI/ListAvatars
 * @param options   Options
 * @param callback  Callback function
 */
const getAvatars = (options, callback) => {
    let queries = '?order=descending&sort=created';
    if (options.user !== undefined) {
        queries += "&user=" + options.user;
    }
    if (options.releaseStatus !== undefined) {
        queries += "&releaseStatus=" + options.releaseStatus;
    }
    if (options.userId !== undefined) {
        queries += "&userId=" + options.userId;
    }
    if (options.amount !== undefined) {
        queries += "&n=" + options.amount;
    }
    if (options.offset !== undefined) {
        queries += "&offset=" + options.offset;
    }
    sendGETRequest("/avatars" + queries, (data) => {
        callback(data);
    });
};

/**
 * List avatar favorites
 * https://vrchatapi.github.io/#/FavoritesAPI/ListFriendFavorites
 * @param callback      Callback function
 */
const getFavoriteAvatars = (callback) => {
    sendGETRequest("/avatars/favorites", (data) => {
        callback(data);
    })
};

/**
 * Accept a friends request
 * https://vrchatapi.github.io/#/NotificationAPI/Delete
 * @param id            Notification ID
 * @param callback      Callback function
 */
const acceptFriendsRequest = (id, callback) => {
    sendPUTRequest("/auth/user/notifications/" + id + "/accept", {}, (data) => {
        callback(data);
    });
};

/**
 * Delete a notification
 * https://vrchatapi.github.io/#/NotificationAPI/Delete
 * @param id            Notification ID
 * @param callback      Callback function
 */
const deleteNotification = (id, callback) => {
    sendPUTRequest("/auth/user/notifications/" + id + "/hide", {}, (data) => {
        callback(data);
    });
};

/**
 * Marks a notification as seen
 * https://vrchatapi.github.io/#/NotificationAPI/MarkAsSeen
 * @param id            Notification ID
 * @param callback      Callback function
 */
const markNotificationAsSeen = (id, callback) => {
    sendPUTRequest("/auth/user/notifications/" + id + "/see", {}, (data) => {
        callback(data);
    });
};

/**
 * Get VRChat notifications
 * https://vrchatapi.github.io/#/UserAPI/Friends
 * @param callback  Callback function
 */
const getNotifications = (callback) => {
    sendGETRequest("/auth/user/notifications", (data) => {
        callback(data);
    });
};


// TODO check listing amount
/**
 * Get VRChat friends list
 * https://vrchatapi.github.io/#/UserAPI/Friends
 * @param options   Options
 * @param callback  Callback function
 */
const getFriends = (options, callback) => {
    let params = "";
    if (options !== undefined) {
        if (options.offline !== undefined && typeof options.offline === "boolean") {
            params = "?offline=" + options.offline;
        }
    }
    sendGETRequest("/auth/user/friends" + params, (data) => {
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
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status.toString().lastIndexOf("4", 0) === 0) {
                addFailedRequest();
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
    addRequest();
    xmlHttp.send(null);
};

/**
 * Send a HTTP POST request to the target URL
 * @param {string} location         Target URL
 * @param {Object} data               Data to send
 * @param {function} callback       Callback function
 */
const sendPOSTRequest = (location, data, callback) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status.toString().lastIndexOf("4", 0) === 0) {
                addFailedRequest();
            }
            const data = JSON.parse(xmlHttp.responseText);
            callback(data);
            console.log("Request received");
            console.log(data);
        }
    };
    console.log("POST Request sent");
    sendNotification("Request sent", "a HTTP POST request was sent", getIconFor("debug"));
    xmlHttp.open("POST", baseUrl + location, true);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    addRequest();
    xmlHttp.send(JSON.stringify(data));
};

/**
 * Send a HTTP PUT request to the target URL
 * @param {string} location         Target URL
 * @param {Object} data               Data to send
 * @param {function} callback       Callback function
 */
const sendPUTRequest = (location, data, callback) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status.toString().lastIndexOf("4", 0) === 0) {
                addFailedRequest()
            }
            const data = JSON.parse(xmlHttp.responseText);
            callback(data);
            console.log("Request received");
            console.log(data);
        }
    };
    console.log("PUT Request sent");
    sendNotification("Request sent", "a HTTP PUT request was sent", getIconFor("debug"));
    xmlHttp.open("PUT", baseUrl + location, true);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    addRequest();
    xmlHttp.send(JSON.stringify(data));
};

/**
 * Send a HTTP DELETE request to the target URL
 * @param {string} location         Target URL
 * @param {function} callback       Callback function
 */
const sendDELETERequest = (location, callback) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status.toString().lastIndexOf("4", 0) === 0) {
                addFailedRequest();
            }
            const data = JSON.parse(xmlHttp.responseText);
            callback(data);
            console.log("Request received");
            console.log(data);
        }
    };
    console.log("DELETE Request sent");
    sendNotification("Request sent", "a HTTP DELETE request was sent", getIconFor("debug"));
    xmlHttp.open("DELETE", baseUrl + location, true);
    addRequest();
    xmlHttp.send(null);
};


/**
 * Log amount of requests
 */
const addRequest = () => {
    const localStorage = window.localStorage;
    localStorage.setItem("requests", (parseInt(localStorage.getItem("requests")) + 1).toString());
};

/**
 * Log amount of failed requests
 */
const addFailedRequest = () => {
    const localStorage = window.localStorage;
    localStorage.setItem("failedRequests", (parseInt(localStorage.getItem("failedRequests")) + 1).toString())
};