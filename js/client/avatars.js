const favoriteLoad = document.getElementById("favoriteLoad");
const privateLoad = document.getElementById("privateLoad");

let avatarPage = 0;

favoriteLoad.addEventListener("click", () => {
    load();
    disableDiv(favoriteLoad);
    getFavoriteAvatars((data) => {
        if (data.error === undefined) {
            stopLoading();
            blinkGreen();
            renderFavorites(data);
        } else {
            enableDiv(favoriteLoad);
            stopLoading();
            blinkRed();
            sendNotification("Error", data.error.message, getIconFor("error"));
        }
    })
});

privateLoad.addEventListener("click", () => {
    load();
    disableDiv(privateLoad);
    getAvatars({offset: avatarPage, releaseStatus: "all", user: "me"}, (data) => {
        enableDiv(privateLoad);
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

const renderFavorites = (data) => {
    const doc = document.getElementById("favoriteAvatars");
    for (let i = 0; i < data.length; i++) {
        const avtr = data[i];
        doc.appendChild(createFavoriteEntry(avtr));
    }
    const parent = favoriteLoad.parentElement;
    doc.removeChild(parent);
};

const createFavoriteEntry = (avatar) => {
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
        createButton("View author", "button-green", () => {
            navToPage("profile", "?u=" + avatar.authorId + "&back=avatars");
        }),
        createButton("Keepsake", "button-green", () => {
            const doc = document.getElementById("keepsakeAvatars");
            doc.appendChild(createKeepsakeEntry(avatar));
            addKeepsake(avatar);
            blinkGreen();
        }),
        createButton("Remove", "button-red", (e) => {
            // There's gotta be a better way to do this but honestly I just don't care
            const options = e.srcElement.parentElement;
            const popup = e.srcElement.parentElement.parentElement.lastElementChild;
            const card = e.srcElement.parentElement.parentElement;
            popup.innerHTML = '';
            popup.style.visibility = "visible";
            popup.appendChild(createElement("a", "header", "Removing..."));

            // progress bar animations
            let progress = 0;
            const progressBar = setInterval(() => {
                popup.style.background = "linear-gradient(#2B2B2B 0%, #2B2B2B " + progress + "%, #9c4242 " + progress + "%, #9c4242 100%)";
                progress += 1;
            }, 50);

            // delayed remove avatar function
            const removeFunc = setTimeout(() => {
                load();
                disableDiv();
                removeFavorite(avatar.id, (data) => {
                    if (data.error !== undefined) {
                        popup.style.visibility = "hidden";
                        clearInterval(progressBar);
                        clearTimeout(removeFunc);
                        stopLoading();
                        blinkRed();
                        sendNotification("Error", data.error.message, getIconFor("error"));
                    } else {
                        options.style.visibility = "visible";
                        options.innerHTML = '';
                        options.appendChild(createElement("a", "header", "Removed"));
                        options.appendChild(createButton("Undo", "button-green", (e) => {
                            load();
                            disableDiv(e.srcElement);
                            addFavorite(avatar.id, "avatar", ["avatars1"], (data) => {
                                if (data.error !== undefined) {
                                    stopLoading();
                                    blinkRed();
                                    enableDiv(e.srcElement);
                                    sendNotification("Error", data.error.message, getIconFor("error"));
                                } else {
                                    card.parentElement.insertAdjacentElement('afterbegin', createFavoriteEntry(avatar));
                                    card.parentNode.removeChild(card);
                                    clearInterval(progressBar);
                                    stopLoading();
                                    blinkGreen();
                                }
                            });
                        }));
                        popup.style.visibility = "hidden";
                        stopLoading();
                        blinkGreen();
                    }
                });
            }, 5000);

            popup.appendChild(createButton("Cancel", "button-red", () => {
                popup.style.visibility = "hidden";
                clearInterval(progressBar);
                clearTimeout(removeFunc);
            }));
        }),
        createButton("Cancel", "button-red", () => {

        })
    ])
};

const renderAvatars = (data) => {
    const doc = document.getElementById("privateAvatars");
    for (let i = 0; i < data.length; i++) {
        const avtr = data[i];
        doc.appendChild(createPrivateEntry(avtr));
    }
    const parent = privateLoad.parentElement;
    doc.appendChild(parent);
};

const createPrivateEntry = (avatar) => {
    return createEntry(avatar.id, avatar.name, avatar.thumbnailImageUrl, avatar.releaseStatus, [
        createButton("Equip", "button-green", (e) => {
            load();
            disableDiv(e.srcElement);
            changeAvatar(avatar.id, (data) => {
                enableDiv(e.srcElement);
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
        createButton("Edit", "button-green", () => {
            editAvatarPopup(avatar);
        }),
        createButton("Download", "button-green", (e) => {
            load();
            disableDiv(e.srcElement);
            getAvatar(avatar.id, (data) => {
                enableDiv(e.srcElement);
                if (data.error === undefined) {
                    if (data.unityPackageUrl !== "") {
                        sendNotification("Download started", avatar.name, getIconFor("error"));
                        downloadFile(data.unityPackageUrl);
                        stopLoading();
                        blinkGreen();
                    } else {
                        sendNotification("Download failed", "Avatar was not uploaded with future proofing enabled.", getIconFor("error"));
                        stopLoading();
                        blinkRed();
                    }
                } else {
                    sendNotification("Download failed", data.error.message, getIconFor("error"));
                    stopLoading();
                    blinkRed();
                }
            });
        }),
        createButton("Remove", "button-red", (e) => {
            // There's gotta be a better way to do this but honestly I just don't care
            const popup = e.srcElement.parentElement.parentElement.lastElementChild;
            const card = e.srcElement.parentElement.parentElement;
            popup.innerHTML = '';
            popup.style.visibility = "visible";
            popup.appendChild(createElement("a", "header", "Removing..."));

            // progress bar animations
            let progress = 0;
            const progressBar = setInterval(() => {
                popup.style.background = "linear-gradient(#2B2B2B 0%, #2B2B2B " + progress + "%, #9c4242 " + progress + "%, #9c4242 100%)";
                progress += 0.5;
            }, 75);

            // delayed remove avatar function
            const removeFunc = setTimeout(() => {
                load();
                deleteAvatar(avatar.id, (data) => {
                    if (data.error === undefined) {
                        card.parentNode.removeChild(card);
                        stopLoading();
                        blinkGreen();
                    } else {
                        sendNotification("Error", data.error.message, getIconFor("error"));
                        stopLoading();
                        blinkRed();
                    }
                })
            }, 15000);

            popup.appendChild(createButton("Cancel", "button-red", () => {
                popup.style.visibility = "hidden";
                clearInterval(progressBar);
                clearTimeout(removeFunc);
            }));

            popup.appendChild(createElement("a", "text-disclaimer", "This action CANNOT be undone once complete"));
        }),
        createButton("Cancel", "button-red", () => {
        })
    ]);
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

const renderKeepsakes = () => {
    const doc = document.getElementById("keepsakeAvatars");
    const keepsakes = JSON.parse(window.localStorage.getItem("keepsakes"));
    for (let i = 0; i < keepsakes.length; i++) {
        const avtr = keepsakes[i];
        doc.appendChild(createKeepsakeEntry(avtr));
    }
};

const createKeepsakeEntry = (avatar) => {
    return createEntry(avatar.id, avatar.name, avatar.thumbnailImageUrl, avatar.releaseStatus, [
        createButton("Equip", "button-green", (e) => {
            load();
            disableDiv(e.srcElement);
            changeAvatar(avatar.id, (data) => {
                enableDiv(e.srcElement);
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
        createButton("Favorite", "button-green", (e) => {
            load();
            disableDiv(e.srcElement);
            addFavorite(avatar.id, "avatar", ["avatars1"], (data) => {
                enableDiv(e.srcElement);
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
        createButton("Remove", "button-red", (e) => {
            // There's gotta be a better way to do this but honestly I just don't care
            const options = e.srcElement.parentElement;
            const popup = e.srcElement.parentElement.parentElement.lastElementChild;
            const card = e.srcElement.parentElement.parentElement;
            popup.innerHTML = '';
            popup.style.visibility = "visible";
            popup.appendChild(createElement("a", "header", "Removing..."));

            // progress bar animations
            let progress = 0;
            const progressBar = setInterval(() => {
                popup.style.background = "linear-gradient(#2B2B2B 0%, #2B2B2B " + progress + "%, #9c4242 " + progress + "%, #9c4242 100%)";
                progress += 1;
            }, 50);

            // delayed remove avatar function
            const removeFunc = setTimeout(() => {
                options.style.visibility = "visible";
                options.innerHTML = '';
                options.appendChild(createElement("a", "header", "Removed"));
                options.appendChild(createButton("Undo", "button-green", () => {
                    card.parentElement.appendChild(createKeepsakeEntry(avatar));
                    card.parentNode.removeChild(card);
                    clearInterval(progressBar);
                    addKeepsake(avatar);
                }));
                removeKeepsake(avatar);
                popup.style.visibility = "hidden";
            }, 5000);

            popup.appendChild(createButton("Cancel", "button-red", () => {
                popup.style.visibility = "hidden";
                clearInterval(progressBar);
                clearTimeout(removeFunc);
            }));
        }),
        createButton("Cancel", "button-red", () => {

        })
    ]);
};

const addKeepsake = (avatar) => {
    const localStorage = window.localStorage;
    const json = JSON.parse(localStorage.getItem("keepsakes"));
    json.push(avatar);
    localStorage.setItem("keepsakes", JSON.stringify(json));
};

const removeKeepsake = (avatar) => {
    const localStorage = window.localStorage;
    const json = JSON.parse(localStorage.getItem("keepsakes"));
    let toRemove;
    for (let i = 0; i < json.length; i++) {
        if (avatar.id === json[i].id) {
            toRemove = i;
        }
    }
    if (toRemove !== undefined) {
        json.splice(toRemove, 1);
        localStorage.setItem("keepsakes", JSON.stringify(json));
    }
};

const editAvatarPopup = (avatar) => {
    let isError = false;
    const body = getId("content");
    const popup = document.getElementById("editMenu");
    const edit = document.getElementById("editContent");
    edit.innerText = '';
    const name = createElement("a", "header", "Editing " + avatar.name);
    const content = createElement("div", "edit-content");
    const imageContainer = createElement("div", "edit-image-container");
    const previewHeader = createElement("a", "header", "Preview");
    const image = createElement("img", "edit-image");
    const imageOverlay = createElement("img", "edit-image-overlay");
    const imageOverlayText = createElement("a", "edit-image-text", avatar.name);
    const settingsContent = createElement("div", "edit-settings-container");
    const buttonContent = createElement("div", "buttons-container");
    image.src = avatar.thumbnailImageUrl;
    imageOverlay.src = "../css/images/nameOverlay.png";
    console.log(avatar);
    edit.appendChild(name);
    image.style.borderColor = "aqua";

    image.onerror = () => {
      image.src = "../css/images/error.png";
      isError = true;
    };

    const nameLabel = createElement("label", "field-input", "Name");
    const nameField = createElement("input", "");
    nameField.placeholder = avatar.name;
    nameField.type = "text";
    nameLabel.appendChild(nameField);
    nameField.onchange = () => {
        if (nameField.value !== '') {
            imageOverlayText.innerText = nameField.value;
        } else {
            imageOverlayText.innerText = avatar.name;
        }
    };
    settingsContent.appendChild(nameLabel);

    const descLabel = createElement("label", "field-input", "Description");
    const descField = createElement("input", "");
    descField.placeholder = avatar.description;
    descField.type = "text";
    descLabel.appendChild(descField);
    settingsContent.appendChild(descLabel);

    const imageLabel = createElement("label", "field-input", "Image URL");
    const imageField = createElement("input", "");
    imageField.placeholder = avatar.imageUrl;
    imageField.type = "text";
    imageField.onchange = () => {
        if (imageField.value !== '') {
            image.src = imageField.value;
        } else {
            image.src = avatar.thumbnailImageUrl;
        }
        isError = false;
    };
    imageLabel.appendChild(imageField);
    settingsContent.appendChild(imageLabel);

    const releaseLabel = createElement("label", "field-input", "Release status");
    const releaseField = createElement("select", "");
    const releasePublic = createElement("option", "", "Public");
    const releasePrivate = createElement("option", "", "Private");
    releasePublic.value = "public";
    releasePrivate.value = "private";
    if (avatar.releaseStatus === "private") {
        releasePrivate.setAttribute("selected", "selected");
    }
    releaseField.appendChild(releasePublic);
    releaseField.appendChild(releasePrivate);
    releaseLabel.appendChild(releaseField);
    settingsContent.appendChild(releaseLabel);

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

        if (releaseField.value !== avatar.releaseStatus) {
            options.releaseStatus = releaseField.value;
        }

        if (JSON.stringify(options) !== "{}") {
            if (isError !== true) {
                load();
                disableDiv(e.srcElement);
                editAvatar(avatar.id, options, (data) => {
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
renderKeepsakes();
finishLoading();