/**
 * Build the friends list with JSON friends list data
 * @param data      Data from /api/1/auth/user/friends
 */
const renderPage = (data) => {
    window.localStorage.setItem("cachedFriends", JSON.stringify(data));
    let list = getId("friendsList");

    const worldsToLoad = [];

    for (let i = 0; i < data.length; i++) {
        const fr = data[i];
        let was = false;
        for (let j = 0; j < worldsToLoad.length; j++) {
            const wrld = worldsToLoad[j];
            if (wrld.world === fr.location) {
                was = true;
            }
        }

        if (was === false && fr.location !== "private" && fr.location !== "offline") {
            const regex = /(.+?):(.+?)($|~((.+?)\(.+))$/;
            const match = regex.exec(fr.location);
            if (match !== undefined && match.length !== 0) {
                let type = "";
                let instance = "";
                let otherId = "";
                let worldId = "";
                if (match.length >= 5) {
                    switch (match[5]) {
                        case "hidden": {
                            type = "Friends+";
                            instance = match[2];
                            otherId = match[2] + match[3];
                            worldId = match[1];
                            break;
                        }
                        case "friends": {
                            type = "Friends Only";
                            instance = match[2];
                            otherId = match[2] + match[3];
                            worldId = match[1];
                            break;
                        }
                        default: {
                            type = "Public";
                            instance = match[2];
                            otherId = match[2];
                            worldId = match[1];
                            break;
                        }
                    }
                }
                worldsToLoad.push({
                    world: fr.location,
                    type: type,
                    instance: instance,
                    otherId: otherId,
                    worldId: worldId,
                    functions: []
                });
            }
        }
    }

    const sortedList = [];

    for (let i = 0; i < data.length; i++) {
        const fr = data[i];
        const entryContainer = createElement("div", "box card-entry-container");
        const entryOptions = createElement("div", "card-options");
        const entryMessage = createElement("div", "card-options message-popup");
        const friendProfileContainer = createElement("div", "friend-profile-container");
        const friendName = createElement("a", "friend-name", fr.displayName);
        const friendImage = createElement("img", "friend-image");
        const friendWorld = createElement("a", "friend-world", "Loading...");
        const friendWorldInstance = createElement("a", "friend-world-instance", "Unknown");
        const friendWorldType = createElement("a", "friend-world-type", "Private");
        const friendWorldContainer = createElement("div", "friend-world-container");

        const optionName = createElement("a", "header", fr.displayName);
        const messageName = createElement("a", "header", fr.displayName);
        optionName.style.marginTop = "-24px";
        entryOptions.appendChild(optionName);
        entryOptions.appendChild(createButton("Profile", "button-green", () => {
        }));

        const textBox = createElement("textarea", "message-container");
        const sendButton = createButton("Send", "button-green", () => {
            if (textBox.value !== "") {
                load();
                sendMessage(fr.id, textBox.value, (data) => {
                    if (data.error === undefined) {
                        stopLoading();
                        blinkGreen();
                        entryMessage.style.visibility = "hidden";
                        textBox.value = "";
                    } else {
                        stopLoading();
                        blinkRed();
                    }
                });
            }
        });

        const cancelButton = createButton("Cancel", "button-red", () => {
            textBox.value = "";
            entryMessage.style.visibility = "hidden";
        });
        textBox.placeholder = "Send a nice message to " + fr.displayName;
        entryMessage.appendChild(messageName);
        entryMessage.appendChild(textBox);
        entryMessage.appendChild(sendButton);
        entryMessage.appendChild(cancelButton);

        entryOptions.appendChild(createButton("Message", "button-green", () => {
            entryMessage.style.visibility = "visible";
        }));

        entryOptions.appendChild(createButton("Unfriend", "button-red", () => {
            entryOptions.style.visibility = "hidden";
        }));

        entryOptions.appendChild(createButton("Cancel", "button-red", () => {
            entryOptions.style.visibility = "hidden";
        }));
        entryContainer.appendChild(entryOptions);
        entryContainer.appendChild(entryMessage);
        friendProfileContainer.addEventListener("click", () => {
            entryOptions.style.visibility = "visible";
        });
        friendImage.setAttribute("src", fr.currentAvatarThumbnailImageUrl);
        let status;
        switch (fr.status) {
            case "active":
                status = "green";
                break;
            case "join me":
                status = "aqua";
                break;
            case "busy":
                status = "red";
                break;
            default:
                status = "white";
        }
        friendImage.setAttribute("style", "border-color: " + status);

        if (fr.location === "private") {
            friendWorld.innerText = "Private World";
        } else {
            for (let j = 0; j < worldsToLoad.length; j++) {
                const wrld = worldsToLoad[j];
                if (wrld.world === fr.location) {
                    friendWorldType.innerText = wrld.type;
                    friendWorldInstance.innerText = "#" + wrld.instance;
                    friendWorldContainer.setAttribute("class", "viewable-world friend-world-container");
                    friendWorldContainer.addEventListener("click", () => {
                        window.localStorage.setItem("oldScroll", window.pageYOffset.toString());
                        pageLoad();
                        setTimeout(() => {
                            document.location = "./instance.html?worldId=" + wrld.worldId + "&otherId=" + wrld.otherId;
                        }, 300);
                    });
                    getWorldNameCached(wrld.worldId, (worldNameC) => {
                        if (worldNameC !== null) {
                            friendWorld.innerText = worldNameC;
                            friendWorldContainer.title = worldNameC;
                        } else {
                            wrld.functions.push((worldName) => {
                                friendWorld.innerText = worldName;
                                friendWorldContainer.title = worldName;
                            });
                        }
                    });
                }
            }
        }
        friendWorldContainer.appendChild(friendWorld);
        friendWorldContainer.appendChild(friendWorldInstance);
        friendWorldContainer.appendChild(friendWorldType);

        const trustColor = trustRankToColor(tagsToTrustRank(fr.tags));
        friendName.style.color = trustColor;
        optionName.style.color = trustColor;
        messageName.style.color = trustColor;

        friendProfileContainer.appendChild(friendName);
        friendProfileContainer.appendChild(friendImage);
        entryContainer.appendChild(friendProfileContainer);
        entryContainer.appendChild(friendWorldContainer);
        sortedList.push({div: entryContainer, location: fr.location})
    }

    const compare = (a, b) => {
        if (a.location > b.location)
            return -1;
        if (a.location < b.location)
            return 1;
        return 0;
    };

    sortedList.sort(compare);
    for (let i = 0; i < sortedList.length; i++) {
        list.appendChild(sortedList[i].div);
    }

    const recursiveLoad = () => {
        if (worldsToLoad.length !== 0) {
            let world = worldsToLoad.shift();
            delayFunction(world.worldId, (e) => {
                if (e !== null) {
                    for (let i = 0; i < world.functions.length; i++) {
                        world.functions[i](e);
                    }
                }
                recursiveLoad();
            })
        } else {
            stopLoading();
            blinkGreen();
        }
    };

    const delayFunction = (e, callback) => {
        getWorldNameCached(e, (worldName) => {
            if (worldName !== null) {
                callback(null);
            } else {
                getWorld(e, (data) => {
                    console.log(e);
                    console.log(data.name);
                    const json = JSON.parse(localStorage.getItem("worldNames"));
                    json[e] = {
                        name: data.name
                    };
                    localStorage.setItem("worldNames", JSON.stringify(json));
                    setTimeout(() => {
                        callback(data.name);
                    }, 3000);
                });
            }
        });
    };
    load();
    recursiveLoad();
    finishLoading();
};

if (getParameterByName("cache") === "1") {
    renderPage(JSON.parse(window.localStorage.getItem("cachedFriends")));
    window.scrollTo(0, parseInt(window.localStorage.getItem("oldScroll")));
} else {
    getFriends((data) => {
        renderPage(data);
    });
}