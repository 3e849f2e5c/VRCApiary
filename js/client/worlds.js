// search
const searchWorlds = getId("searchWorlds");
// active
let activePage = 0;
let prevActiveWorlds = [];
const activeWorlds = getId("popularWorlds");
const activeLoad = getId("popularLoad");
// new
let newPage = 0;
const prevNewWorlds = [];
const newWorlds = getId("newWorlds");
const newLoad = getId("newLoad");
// history
let historyPage = 0;
const prevHistoryWorlds = [];
const historyWorlds = getId("historyWorlds");
const historyLoad = getId("historyLoad");
// mine
let myPage = 0;
const prevMyWorlds = [];
const myWorlds = getId("myWorlds");
const myLoad = getId("myLoad");
// favorites
const favoriteWorlds = getId("favoriteWorlds");
const favoriteLoad = getId("favoriteLoad");

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

const createEntry = (world, id, name, image, status, extra) => {
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

const createWorldEntry = (world, buttons) => {
    return createEntry(world, world.id, world.name, world.thumbnailImageUrl, world.releaseStatus, buttons)
};

// activeLoad.addEventListener("click", () => {
const renderActive = (cache) => {
    const loadWorlds = (data) => {
        for (let i = 0; i < data.length; i++) {
            const wrld = data[i];
            let was = false;
            for (let j = 0; j < prevActiveWorlds.length; j++) {
                if (wrld.id === prevActiveWorlds[j]) {
                    was = true;
                }
            }
            if (was === false) {
                activeWorlds.appendChild(createWorldEntry(wrld, [
                    createButton("Details", "button-green", () => {
                        navToPage("world", "?w=" + wrld.id + "&back=worlds&backtags=" + encodeURIComponent("?cache=1"));
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
                prevActiveWorlds.push(wrld.id);
            }
        }
        const parent = activeLoad.parentElement;
        activeWorlds.appendChild(parent);
    };

    if (cache !== undefined && cache !== null) {
        loadWorlds(cache);
        activePage = cache.length;
    } else {
        load();
        disableDiv(activeLoad);
        getWorlds({active: true, offset: activePage}, (data) => {
            stopLoading();
            if (data.error === undefined) {
                localStoragePut("worldsList", "active", data);
                loadWorlds(data);
                activePage += 11;
                blinkGreen();
            } else {
                blinkRed();
                sendError(data, "VRChat API");
            }
            enableDiv(activeLoad);
        });
    }
};

const renderNew = (cache) => {
    const loadWorlds = (data) => {
        for (let i = 0; i < data.length; i++) {
            const wrld = data[i];
            let was = false;
            for (let j = 0; j < prevNewWorlds.length; j++) {
                if (wrld.id === prevNewWorlds[j]) {
                    was = true;
                }
            }
            if (was === false) {
                newWorlds.appendChild(createWorldEntry(wrld, [
                    createButton("Details", "button-green", () => {
                        navToPage("world", "?w=" + wrld.id + "&back=worlds&backtags=" + encodeURIComponent("?cache=1"));
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
                prevNewWorlds.push(wrld.id);
            }
        }
        const parent = newLoad.parentElement;
        newWorlds.appendChild(parent);
    };
    if (cache !== undefined && cache !== null) {
        loadWorlds(cache);
        newPage = cache.length;
    } else {
        load();
        disableDiv(newLoad);
        getWorlds({offset: newPage, sort: "created"}, (data) => {
            stopLoading();
            if (data.error === undefined) {
                localStoragePut("worldsList", "new", data);
                loadWorlds(data);
                newPage += 10;
                blinkGreen();
            } else {
                blinkRed();
                sendError(data, "VRChat API");
            }
            enableDiv(newLoad);
        });
    }

};

const renderMine = (cache) => {
    const loadWorlds = (data) => {
        for (let i = 0; i < data.length; i++) {
            const wrld = data[i];
            let was = false;
            for (let j = 0; j < prevMyWorlds.length; j++) {
                if (wrld.id === prevMyWorlds[j]) {
                    was = true;
                }
            }
            if (was === false) {
                myWorlds.appendChild(createWorldEntry(wrld, [
                    createButton("Details", "button-green", () => {
                        navToPage("world", "?w=" + wrld.id + "&back=worlds&backtags=" + encodeURIComponent("?cache=1"));
                    }),
                    createButton("Quick join", "button-green", () => {
                        createAndJoinWorld(wrld.id);
                    }),
                    createButton("Edit", "button-green", () => {
                        editWorldPopup(wrld);
                    }),
                    createButton("Download", "button-green", (e) => {
                        load();
                        disableDiv(e.srcElement);
                        getWorld(wrld.id, (data) => {
                            enableDiv(e.srcElement);
                            if (data.error === undefined) {
                                if (data.unityPackageUrl !== "") {
                                    sendNotification("Download started", wrld.name, getIconFor("ok"));
                                    downloadFile(data.unityPackageUrl);
                                    stopLoading();
                                    blinkGreen();
                                } else {
                                    sendError({error:{message:"World was not uploaded with future proofing enabled."}}, "VRCApiary");
                                    stopLoading();
                                    blinkRed();
                                }
                            } else {
                                sendError(data, "VRChat API");
                                stopLoading();
                                blinkRed();
                            }
                        });
                    }),
                    createButton("Remove", "button-red disabled", () => {

                    }),
                    createButton("Cancel", "button-red", () => {

                    })
                ]));
                prevMyWorlds.push(wrld.id);
            }
        }
        const parent = myLoad.parentElement;
        myWorlds.appendChild(parent);
    };
    if (cache !== undefined && cache !== null) {
        loadWorlds(cache);
        myPage = cache.length;
    } else {
        load();
        disableDiv(myLoad);
        getWorlds({offset: myPage, sort: "created", user: "me", releaseStatus: "all"}, (data) => {
            stopLoading();
            if (data.error === undefined) {
                localStoragePut("worldsList", "mine", data);
                loadWorlds(data);
                myPage += 10;
                blinkGreen();
            } else {
                blinkRed();
                sendError(data, "VRChat API");
            }
            enableDiv(myLoad);
        });
    }
};

const renderHistory = (cache) => {
    const loadWorlds = (data) => {
        for (let i = 0; i < data.length; i++) {
            const wrld = data[i];
            let was = false;
            for (let j = 0; j < prevHistoryWorlds.length; j++) {
                if (wrld.id === prevHistoryWorlds[j]) {
                    was = true;
                }
            }
            if (was === false) {
                historyWorlds.appendChild(createWorldEntry(wrld, [
                    createButton("Details", "button-green", () => {
                        navToPage("world", "?w=" + wrld.id + "&back=worlds&backtags=" + encodeURIComponent("?cache=1"));
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
                prevHistoryWorlds.push(wrld.id);
            }
        }
        const parent = historyLoad.parentElement;
        historyWorlds.appendChild(parent);
    };
    if (cache !== undefined && cache !== null) {
        loadWorlds(cache);
        historyPage = cache.length;
    } else {
        load();
        disableDiv(historyLoad);
        getWorlds({offset: historyPage, recent: true}, (data) => {
            stopLoading();
            if (data.error === undefined) {
                localStoragePut("worldsList", "history", data);
                loadWorlds(data);
                historyPage += 10;
                blinkGreen();
            } else {
                blinkRed();
                sendError(data, "VRChat API");
            }
            enableDiv(historyLoad);
        });
    }
};

const editWorldPopup = (world) => {
    let isError = false;
    const body = getId("content");
    const popup = document.getElementById("editMenu");
    const edit = document.getElementById("editContent");
    edit.innerText = '';
    const name = createElement("a", "header", "Editing " + world.name);
    const content = createElement("div", "edit-content");
    const imageContainer = createElement("div", "edit-image-container");
    const previewHeader = createElement("a", "header", "Preview");
    const image = createElement("img", "edit-image");
    const imageOverlay = createElement("img", "edit-image-overlay");
    const imageOverlayText = createElement("a", "edit-image-text", world.name);
    const settingsContent = createElement("div", "edit-settings-container");
    const buttonContent = createElement("div", "buttons-container");
    image.src = world.thumbnailImageUrl;
    imageOverlay.src = "../css/images/nameOverlay.png";
    console.log(world);
    edit.appendChild(name);
    image.style.borderColor = "aqua";

    image.onerror = () => {
        image.src = "../css/images/error.png";
        isError = true;
    };

    const nameLabel = createElement("label", "field-input", "Name");
    const nameField = createElement("input", "");
    nameField.placeholder = world.name;
    nameField.type = "text";
    nameLabel.appendChild(nameField);
    nameField.onchange = () => {
        if (nameField.value !== '') {
            imageOverlayText.innerText = nameField.value;
        } else {
            imageOverlayText.innerText = world.name;
        }
    };
    settingsContent.appendChild(nameLabel);

    const descLabel = createElement("label", "field-input", "Description");
    const descField = createElement("input", "");
    descField.placeholder = "world description";
    descField.type = "text";
    descLabel.appendChild(descField);
    settingsContent.appendChild(descLabel);

    const imageLabel = createElement("label", "field-input", "Image URL");
    const imageField = createElement("input", "");
    imageField.placeholder = world.imageUrl;
    imageField.type = "text";
    imageField.onchange = () => {
        if (imageField.value !== '') {
            image.src = imageField.value;
        } else {
            image.src = world.thumbnailImageUrl;
        }
        isError = false;
    };
    imageLabel.appendChild(imageField);
    settingsContent.appendChild(imageLabel);

    const capacityLabel = createElement("label", "field-input", "Capacity");
    const capacityField = createElement("input", "");
    capacityField.placeholder = world.capacity;
    capacityField.type = "text";
    capacityLabel.appendChild(capacityField);
    settingsContent.appendChild(capacityLabel);

    buttonContent.appendChild(createButton("Update", "button-green", (e) => {
        const options = {};

        if (imageField.value !== '') {
            options.imageUrl = imageField.value;
        }

        if (nameField.value !== '') {
            options.name = nameField.value;
        }

        if (descField.value !== '') {
            options.description = descField.value;
        }

        if (capacityField.value !== '') {
            options.description = descField.value;
            if (new RegExp(/^[0-9]+$/).test(capacityField.value) === true) {
                try {
                    const i = parseInt(capacityField.value);
                    if (i > 0 && i <= 64) {
                        options.capacity = i;
                    }
                } catch (e) {
                    // ignored
                }
            }
        }

        if (JSON.stringify(options) !== "{}") {
            if (isError !== true) {
                load();
                disableDiv(e.srcElement);
                editWorld(world.id, options, (data) => {
                    if (data.error === undefined) {
                        sendNotification("Avatar updated", "Please give VRChat servers couple minutes to process your changes", getIconFor("ok"));
                        popup.style.opacity = "0";
                        setTimeout(() => {
                            popup.style.visibility = "hidden";
                            if (body !== null) {
                                body.style.filter = "none";
                            }
                        }, 100);
                        stopLoading();
                        blinkGreen();
                    } else {
                        sendError(data, "VRChat API");
                        stopLoading();
                        blinkRed();
                    }
                })
            } else {
                sendError({error: {message: "Image must be a direct link to an image"}}, "VRCApiary");
            }
        }
    }));
    buttonContent.appendChild(createButton("Cancel", "button-red", () => {
        popup.style.opacity = "0";
        setTimeout(() => {
            popup.style.visibility = "hidden";
            if (body !== null) {
                body.style.filter = "none";
            }
        }, 100);
    }));

    imageContainer.appendChild(previewHeader);
    imageContainer.appendChild(image);
    imageContainer.appendChild(imageOverlay);
    imageContainer.appendChild(imageOverlayText);
    content.appendChild(imageContainer);
    content.appendChild(settingsContent);
    edit.appendChild(content);
    edit.appendChild(buttonContent);
    setTimeout(() => {
        if (body !== null) {
            body.style.filter = "blur(4px)";
        }
        popup.style.visibility = "visible";
        setTimeout(() => {
            popup.style.opacity = "1";
        }, 0);
    }, 100);
};

activeLoad.addEventListener('click', () => {
    renderActive();
});
newLoad.addEventListener('click', () => {
    renderNew();
});
myLoad.addEventListener('click', () => {
    renderMine();
});
historyLoad.addEventListener('click', () => {
    renderHistory();
});

if (getParameterByName("cache") === "1") {
    const active = localStorageFetch("worldsList", "active");
    if (active !== null && active !== undefined) {
        renderActive(active);
    }

    const news = localStorageFetch("worldsList", "new");
    if (news !== null && news !== undefined) {
        renderNew(news);
    }

    const mine = localStorageFetch("worldsList", "mine");
    if (mine !== null && mine !== undefined) {
        renderMine(mine);
    }

    const history = localStorageFetch("worldsList", "history");
    if (history !== null && history !== undefined) {
        renderHistory(history);
    }
} else {
    localStorageClear("worldsList");
}
finishLoading();