let avatarPage = 0;

let worldPage = 0;
const publicWorlds = getId("publicWorlds");
const worldsLoad = getId("worldsLoad");

const setHome = (wrld) => {
    load();
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    editUser(userData.id, {
        homeLocation: wrld.id
    }, (data) => {
        stopLoading();
        if (data.error === undefined) {
            window.localStorage.setItem("userData", JSON.stringify(data));
            sendNotification("Home world set", wrld.name, getIconFor("ok"));
            blinkGreen();
        } else {
            sendError(data, "VRChat API");
            blinkRed();
        }
    })
};

const renderPage = (profile) => {
    const publicLoad = getId("publicLoad");
    publicLoad.addEventListener("click", () => {
        load();
        disableDiv(publicLoad);
        getAvatars({offset: avatarPage, releaseStatus: "public", userId: profile.id}, (data) => {
            enableDiv(publicLoad);
            if (data.error === undefined) {
                stopLoading();
                blinkGreen();
                renderAvatars(data);
                avatarPage += 10;
            } else {
                stopLoading();
                blinkRed();
                sendError(data, "VRChat API");
            }
        })
    });

    worldsLoad.addEventListener('click', () => {
        renderWorlds(profile.id);
    });

    // let isFriend = (profile.friendKey !== undefined);
    // let isBlocked = (profile.friendKey !== undefined);

    getId("display-name").innerText = profile.displayName;
    getId("user-name").innerText = profile.username;
    getId("user-id").innerText = profile.id;
    getId("user-id").innerText = profile.id;
    getId("avatar-image").src = profile.currentAvatarThumbnailImageUrl;
    if (profile.statusDescription !== undefined) {
        if (profile.statusDescription === "") {
            getId("status").innerText = "None";
        } else {
            getId("status").innerText = profile.statusDescription;
        }
    }

    if (profile.status !== undefined) {
        switch (profile.status) {
            case "active": {
                getId("avatar-image").setAttribute("style", "border-color: green;");
                break;
            }
            case "join me": {
                getId("avatar-image").setAttribute("style", "border-color: aqua;");
                break;
            }
            case "busy": {
                getId("avatar-image").setAttribute("style", "border-color: red;");
                break;
            }
        }
    }

    const trustMeterShrinker = getId("trustBarShrink");
    const trustBar = getId("trustBar");
    const trustImage = getId("trustImage");
    const trustInfo = getId("trustInfo");

    switch (tagsToTrustRank(profile.tags)) {
        case -2: {
            trustMeterShrinker.style.width = "100%";
            trustImage.setAttribute("src", "../css/images/trust/0.png");
            trustInfo.innerText = "Nuisance";
            trustMeterShrinker.style.width = "0";
            trustBar.style.backgroundColor = "#ff2328";
            break;
        }
        case -1: {
            trustMeterShrinker.style.width = "50%";
            trustImage.setAttribute("src", "../css/images/trust/1.png");
            trustInfo.innerText = "Troll";
            trustBar.style.backgroundColor = "#ff2328";
            break;
        }
        case 0: {
            trustMeterShrinker.style.width = "83%";
            trustImage.setAttribute("src", "../css/images/trust/2.png");
            trustInfo.innerText = "Visitor";
            trustBar.style.backgroundColor = "#cccccc";
            break;
        }
        case 1: {
            trustMeterShrinker.style.width = "66.4%";
            trustImage.setAttribute("src", "../css/images/trust/3.png");
            trustInfo.innerText = "New User";
            trustBar.style.backgroundColor = "#1778ff";
            break;
        }
        case 2: {
            trustMeterShrinker.style.width = "49.8%";
            trustImage.setAttribute("src", "../css/images/trust/4.png");
            trustInfo.innerText = "User";
            trustBar.style.backgroundColor = "#2bcf5c";
            break;
        }
        case 3: {
            trustMeterShrinker.style.width = "33.2%";
            trustInfo.innerText = "Known User";
            trustImage.setAttribute("src", "../css/images/trust/5.png");
            trustBar.style.backgroundColor = "#ff7b42";
            break;
        }
        case 4: {
            trustMeterShrinker.style.width = "16.6%";
            trustInfo.innerText = "Trusted User";
            trustImage.setAttribute("src", "../css/images/trust/6.png");
            trustBar.style.backgroundColor = "#8143e6";
            break;
        }
        case 5: {
            trustMeterShrinker.style.width = "0";
            trustInfo.innerText = "Veteran";
            trustImage.setAttribute("src", "../css/images/trust/7.png");
            trustBar.style.backgroundColor = "#ffff00";
            break;
        }
    }
    const btn = getId("buttons");
    // if (isFriend === false) {
    //     btn.appendChild(createButton("Unfriend", "button-red", (e) => {
    //     }));
    // } else {
    //     btn.appendChild(createButton("Add friend", "button-green", (e) => {
    //         e.srcElement.disabled = true;
    //         setTimeout(() => {
    //             e.srcElement.innerText = "Request sent";
    //             e.srcElement.disabled = true;
    //         }, 1000);
    //     }));
    // }
    //
    // if (isBlocked === true) {
    //     btn.appendChild(createButton("Block", "button-red", (e) => {
    //
    //     }));
    // } else {
    //     btn.appendChild(createButton("Unblock", "button-green", (e) => {
    //
    //     }));
    // }

    btn.appendChild(createButton("Back", "button-red", (e) => {
        goBack();
    }));
    finishLoading();
};

const renderAvatars = (data) => {
    const doc = document.getElementById("publicAvatars");
    for (let i = 0; i < data.length; i++) {
        const avtr = data[i];
        doc.appendChild(createPublicEntry(avtr));
    }
    const parent = getId("publicLoad").parentElement;
    doc.appendChild(parent);
};

const createPublicEntry = (avatar) => {
    return createEntry(avatar.id, avatar.name, avatar.thumbnailImageUrl, avatar.releaseStatus, [
        createButton("Equip", "button-green", () => {
            load();
            changeAvatar(avatar.id, (data) => {
                if (data.error !== undefined) {
                    stopLoading();
                    blinkRed();
                    sendError(data, "VRChat API");
                } else {
                    stopLoading();
                    blinkGreen();
                    window.localStorage.setItem("userData", JSON.stringify(data));
                }
            });
        }),
        createButton("Favorite", "button-green", () => {
            load();
            addFavorite(avatar.id, "avatar", ["avatars1"], (data) => {
                if (data.error !== undefined) {
                    stopLoading();
                    blinkRed();
                    sendError(data, "VRChat API");
                } else {
                    stopLoading();
                    blinkGreen();
                    document.getElementById("favoriteAvatars").insertAdjacentElement('afterbegin', createFavoriteEntry(avatar));
                }
            });
        }),
        createButton("Keepsake", "button-green", () => {
            addKeepsake(avatar);
        }),
        createButton("Cancel", "button-red", () => {

        })
    ])
};

const addKeepsake = (avatar) => {
    const localStorage = window.localStorage;
    const json = JSON.parse(localStorage.getItem("keepsakes"));
    json.push(avatar);
    localStorage.setItem("keepsakes", JSON.stringify(json));
    blinkGreen();
};

const renderWorlds = (id) => {
    const loadWorlds = (data) => {
        for (let i = 0; i < data.length; i++) {
            const wrld = data[i];
            publicWorlds.appendChild(createPublicWorldEntry(wrld, [
                createButton("Details", "button-green", () => {
                    navWithBacktags("world", "?w=" + wrld.id, "profile", "?u=" + id);
                }),
                createButton("Quick join", "button-green", () => {
                    createAndJoinWorld(wrld.id);
                }),
                createButton("Set home", "button-green", () => {
                    setHome(wrld);
                }),
                createButton("Cancel", "button-red", () => {

                })
            ]));
        }
        const parent = worldsLoad.parentElement;
        publicWorlds.appendChild(parent);
    };
    load();
    disableDiv(worldsLoad);
    getWorlds({userId: id, offset: worldPage}, (data) => {
        stopLoading();
        if (data.error === undefined) {
            loadWorlds(data);
            worldPage += 10;
            blinkGreen();
        } else {
            blinkRed();
            sendError(data, "VRChat API");
        }
        enableDiv(worldsLoad);
    });
};

const createWorldEntry = (world, id, name, image, status, extra) => {
    const entryContainer = createElement("div", "box card-entry-container");
    const entryOptions = createElement("div", "card-options");
    const entryDeleteTimeout = createElement("div", "card-options card-remove-timeout");
    const avatarContainer = createElement("div", "card-inner-container");
    const avatarName = createElement("a", "card-name", name);
    const avatarImage = createElement("img", "card-image");
    avatarImage.setAttribute("src", image);
    switch (status) {
        case "private": {
            avatarImage.style.borderColor = "red";
            break;
        }
        case "public": {
            avatarImage.style.borderColor = "aqua";
            break;
        }
    }

    if (world.tags.indexOf("system_labs") !== -1) {
        avatarImage.style.borderColor = "green";
    }
    avatarContainer.addEventListener('click', () => {
        entryOptions.style.visibility = "visible";
    });
    avatarContainer.setAttribute("title", name);
    avatarContainer.appendChild(avatarName);
    avatarContainer.appendChild(avatarImage);
    entryContainer.appendChild(avatarContainer);
    if (extra !== undefined && extra.length !== 0) {
        for (let i = 0; i < extra.length; i++) {
            extra[i].addEventListener('click', () => {
                entryOptions.style.visibility = "hidden";
            });
            entryOptions.appendChild(extra[i]);
        }
    }
    const cardDescription = createElement("div", "card-description-container");
    const heatBar = createElement("div", "box heat-bar");
    const heatPercentage = Math.floor((world.heat * 100) / 7);
    heatBar.style.background = "linear-gradient(90deg, #CB772F " + heatPercentage + "%, rgba(0,0,0,0) " + heatPercentage + "%, rgba(0,0,0,0) 100%)";
    heatBar.title = "Heat";
    cardDescription.appendChild(heatBar);
    cardDescription.appendChild(createElement("a", "", "Users: " + world.occupants));
    entryContainer.appendChild(cardDescription);
    entryContainer.appendChild(entryOptions);
    entryContainer.appendChild(entryDeleteTimeout);
    return entryContainer;
};

const createPublicWorldEntry = (world, buttons) => {
    return createWorldEntry(world, world.id, world.name, world.thumbnailImageUrl, world.releaseStatus, buttons)
};

const createEntry = (id, name, image, status, extra) => {
    const entryContainer = createElement("div", "box card-entry-container");
    const entryOptions = createElement("div", "card-options");
    const entryDeleteTimeout = createElement("div", "card-options card-remove-timeout");
    const avatarContainer = createElement("div", "card-inner-container");
    const avatarName = createElement("a", "card-name", name);
    const avatarImage = createElement("img", "card-image");
    avatarImage.setAttribute("src", image);
    switch (status) {
        case "private": {
            avatarImage.style.borderColor = "red";
            break;
        }
        case "public": {
            avatarImage.style.borderColor = "aqua";
            break;
        }
    }
    avatarContainer.setAttribute("title", name);
    avatarContainer.appendChild(avatarName);
    avatarContainer.appendChild(avatarImage);
    entryContainer.appendChild(avatarContainer);
    if (extra !== undefined && extra.length !== 0) {
        for (let i = 0; i < extra.length; i++) {
            extra[i].addEventListener('click', () => {
                entryOptions.style.visibility = "hidden";
            });
            entryOptions.appendChild(extra[i]);
        }
    }
    entryContainer.appendChild(createButton("Options", "button-green", () => {
        entryOptions.style.visibility = "visible";
    }));
    entryContainer.appendChild(entryOptions);
    entryContainer.appendChild(entryDeleteTimeout);
    return entryContainer;
};

getUser(getParameterByName("u", document.location), (data) => {
    renderPage(data);
});

