let avatarPage = 0;

const renderPage = (profile) => {
    getId("publicLoad").addEventListener("click", () => {
        load();
        getAvatars({offset: avatarPage, releaseStatus: "public", userId: profile.id}, (data) => {
            if (data.error === undefined) {
                stopLoading();
                blinkGreen();
                renderAvatars(data);
                avatarPage += 10;
            } else {
                stopLoading();
                blinkRed();
                sendNotification("Error", data.error.message, getIconFor("error"));
            }
        })
    });

    // let isFriend = (profile.friendKey !== undefined);
    // let isBlocked = (profile.friendKey !== undefined);

    getId("display-name").innerText = profile.displayName;
    getId("user-name").innerText = profile.username;
    getId("user-id").innerText = profile.id;
    getId("user-id").innerText = profile.id;
    getId("avatar-image").src = profile.currentAvatarThumbnailImageUrl;
    if (profile.statusDescription !== undefined) {
        getId("status").innerText = profile.statusDescription;
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
        navToPage(getParameterByName("back", document.location), atob(getParameterByName("backtags", document.location)));
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
                    sendNotification("Error", data.error.message, getIconFor("error"));
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
                    sendNotification("Error", data.error.message, getIconFor("error"));
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

