let currentWorld;

getId("nextWorldButton").addEventListener('click', () => {
    load();
    const rand = Math.floor(Math.random() * (14500 + 1));
    getWorlds({amount: 1, offset: rand, sort: "shuffle"}, (data) => {
        stopLoading();
        blinkGreen();
        currentWorld = data[0];
        getId("worldName").innerText = currentWorld.name;
        getId("creatorName").innerText = currentWorld.authorName;
        getId("worldId").innerText = currentWorld.id;
        getId("worldId").innerText = currentWorld.id;
        getId("worldImage").src = currentWorld.thumbnailImageUrl;
        getId("description").innerHTML = `Visits: ${currentWorld.visits}\nCreated: ${new Date(currentWorld.created_at).toLocaleDateString("ja-JP")}`
    });
});

getId("addMembers").addEventListener('click', () => {
    getId("popupMenu").style.visibility = "visible";
    getId("popupMenu").style.opacity = "1";
});

getId("popupExit").addEventListener('click', () => {
    getId("popupMenu").style.visibility = "hidden";
    getId("popupMenu").style.opacity = "0";
});

getId("goButton").addEventListener('click', () => {
    if (currentWorld !== null) {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const world = createWorld(currentWorld.id);
        const party = [{user: userData.id, world: world}];

        const localParty = JSON.parse(localStorage.getItem("party"));
        for (let i = 0; i < localParty.length; i++) {
            party.push({
                user: localParty[i].id,
                world: world
            })
        }
        load();
        sendRawPostRequest("http://localhost:4567/sendRequests", party, () => {
            stopLoading();
            blinkGreen();
        });
    }
});

const renderNotifications = () => {
    const localParty = JSON.parse(localStorage.getItem("party"));
    const area = getId("notifyArea");
    area.innerHTML = '';
    for (let i = 0; i < localParty.length; i++) {
        const member = localParty[i];

        const entryContainer = createElement("div", "box card-entry-container offline-entry");
        const friendProfileContainer = createElement("div", "party-profile-container");
        const friendName = createElement("a", "friend-name", member.displayName);
        const friendImage = createElement("img", "friend-image");

        const optionName = createElement("a", "header", member.displayName);

        friendProfileContainer.title = member.username;
        friendProfileContainer.style.marginBottom = "8px";

        friendProfileContainer.addEventListener('click', (e) => {
            const newParty = localParty.filter((value, index, arr) => {
                return value.id !== member.id;
            });
            localStorage.setItem("party", JSON.stringify(newParty));
            renderNotifications();
        });

        friendImage.setAttribute("src", member.currentAvatarThumbnailImageUrl);

        const trustColor = trustRankToColor(tagsToTrustRank(member.tags));
        friendName.style.color = trustColor;
        optionName.style.color = trustColor;

        const addBotButton = createElement("img", "bot-button");
        addBotButton.src = "../css/images/notifications/friendrequest.png";

        addBotButton.addEventListener('click', () => {
            load();
            sendRawPostRequest("http://localhost:4567/sendFriendInvite", member.id, () => {
                stopLoading();
                blinkGreen();
            });
        });

        entryContainer.appendChild(addBotButton);
        friendProfileContainer.appendChild(friendName);
        friendProfileContainer.appendChild(friendImage);
        entryContainer.appendChild(friendProfileContainer);

        area.appendChild(entryContainer);
    }
    finishLoading();
};

renderNotifications();

const searchField = getId("searchInput");
const list = getId("socialList");

searchField.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && searchField.classList.contains("disabled") === false) {
        if (searchField.value !== "") {
            disableDiv(searchField);
            load();
            getUsers({search: encodeURIComponent(searchField.value), amount: 25}, (data) => {
                stopLoading();
                enableDiv(searchField);
                if (data.error === undefined) {
                    window.localStorage.setItem("cachedSocial", JSON.stringify(data));
                    blinkGreen();
                    renderSocial(data);
                } else {
                    blinkRed();
                    sendError(data, "VRChat API")
                }
            });
        }
    }
});

const renderSocial = (data) => {
    list.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const fr = data[i];
        list.appendChild(createSocialEntry(fr));
    }
};

const createSocialEntry = (fr) => {
    const entryContainer = createElement("div", "box card-entry-container offline-entry");
    const friendProfileContainer = createElement("div", "friend-profile-container");
    const friendName = createElement("a", "friend-name", fr.displayName);
    const friendImage = createElement("img", "friend-image");

    const optionName = createElement("a", "header", fr.displayName);

    friendProfileContainer.title = fr.username;
    friendProfileContainer.style.marginBottom = "8px";

    friendProfileContainer.addEventListener('click', (e) => {
        const party = JSON.parse(localStorage.getItem("party"));
        party.push(fr);
        localStorage.setItem("party", JSON.stringify(party));
        const img = createElement("img", "checkmark-icon");
        img.src = "../css/images/ok.png";
        friendProfileContainer.appendChild(img);
        renderNotifications();
    });

    friendImage.setAttribute("src", fr.currentAvatarThumbnailImageUrl);

    const trustColor = trustRankToColor(tagsToTrustRank(fr.tags));
    friendName.style.color = trustColor;
    optionName.style.color = trustColor;

    friendProfileContainer.appendChild(friendName);
    friendProfileContainer.appendChild(friendImage);
    entryContainer.appendChild(friendProfileContainer);
    return entryContainer;
};

const sendRawPostRequest = (location, data, callback) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4) {
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open("POST", location, true);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.send(JSON.stringify(data));
};

finishLoading();