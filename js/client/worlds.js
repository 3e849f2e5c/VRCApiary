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
const renderActive = () => {
    load();
    disableDiv(activeLoad);
    getWorlds({active: true, offset: activePage}, (data) => {
        stopLoading();
        if (data.error === undefined) {
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
                            navToPage("world", "?w=" + wrld.id + "&back=worlds")
                        }),
                        createButton("Quick join", "button-green disabled", () => {

                        }),
                        createButton("Set home", "button-green disabled", () => {

                        }),
                        createButton("View author", "button-green", () => {

                        }),
                        createButton("Cancel", "button-red", () => {

                        })
                    ]));
                    prevActiveWorlds.push(wrld.id);
                }
            }
            const parent = activeLoad.parentElement;
            activeWorlds.appendChild(parent);
            activePage += 10;
            blinkGreen();
        } else {
            blinkRed();
            sendNotification("Error", data.error.message, getIconFor("error"));
        }
        enableDiv(activeLoad);
    });
};

const renderNew = () => {
    load();
    disableDiv(newLoad);
    getWorlds({offset: newPage, sort: "created"}, (data) => {
        stopLoading();
        if (data.error === undefined) {
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
                        createButton("Details", "button-green disabled", () => {
                            navToPage("world", "?w=" + wrld.id + "&back=worlds")
                        }),
                        createButton("Quick join", "button-green disabled", () => {

                        }),
                        createButton("Set home", "button-green disabled", () => {

                        }),
                        createButton("View author", "button-green", () => {

                        }),
                        createButton("Cancel", "button-red", () => {

                        })
                    ]));
                    prevNewWorlds.push(wrld.id);
                }
            }
            const parent = newLoad.parentElement;
            newWorlds.appendChild(parent);
            newPage += 10;
            blinkGreen();
        } else {
            blinkRed();
            sendNotification("Error", data.error.message, getIconFor("error"));
        }
        enableDiv(newLoad);
    });
};

const renderMine = () => {
    load();
    disableDiv(myLoad);
    getWorlds({offset: myPage, sort: "created", user: "me", releaseStatus: "all"}, (data) => {
        stopLoading();
        if (data.error === undefined) {
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
                        createButton("Details", "button-green disabled", () => {
                            navToPage("world", "?w=" + wrld.id + "&back=worlds")
                        }),
                        createButton("Quick join", "button-green disabled", () => {

                        }),
                        createButton("Edit", "button-green", () => {
                            editWorldPopup(wrld);
                        }),
                        createButton("Download", "button-green", () => {

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
            myPage += 10;
            blinkGreen();
        } else {
            blinkRed();
            sendNotification("Error", data.error.message, getIconFor("error"));
        }
        enableDiv(myLoad);
    });
};

const renderHistory = () => {
    load();
    disableDiv(historyLoad);
    getWorlds({offset: historyPage, recent: true}, (data) => {
        stopLoading();
        if (data.error === undefined) {
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
                        createButton("Details", "button-green disabled", () => {
                            navToPage("world", "?w=" + wrld.id + "&back=worlds")
                        }),
                        createButton("Quick join", "button-green disabled", () => {

                        }),
                        createButton("Set home", "button-green disabled", () => {

                        }),
                        createButton("Cancel", "button-red", () => {

                        })
                    ]));
                    prevHistoryWorlds.push(wrld.id);
                }
            }
            const parent = historyLoad.parentElement;
            historyWorlds.appendChild(parent);
            newPage += 10;
            blinkGreen();
        } else {
            blinkRed();
            sendNotification("Error", data.error.message, getIconFor("error"));
        }
        enableDiv(historyLoad);
    });
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
                        sendNotification("Error", data.error.message, getIconFor("error"));
                        stopLoading();
                        blinkRed();
                    }
                })
            } else {
                sendNotification("Image is not valid", "Image must be a direct link to an image", getIconFor("error"));
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

finishLoading();