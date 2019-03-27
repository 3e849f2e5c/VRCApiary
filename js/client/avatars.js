
const renderFavorites = (data) => {
    const doc = document.getElementById("favoriteAvatars");
    for (let i = 0; i < data.length; i++) {
        const avtr = data[i];
        doc.appendChild(createFavoriteEntry(avtr));
    }
};


// TODO remove timeout
const createFavoriteEntry = (avatar) => {
    return createEntry(avatar.id, avatar.name, avatar.thumbnailImageUrl, avatar.releaseStatus, [
        createButton("Equip", "button-green", () => {

        }),
        createButton("View author", "button-green", () => {

        }),
        createButton("Keepsake", "button-green", () => {

        }),
        createButton("Remove", "button-red", (e) => {
            // There's gotta be a better way to do this but honestly I just don't care
            const options = e.srcElement.parentElement;
            const popup = e.srcElement.parentElement.parentElement.lastElementChild;
            const card = e.srcElement.parentElement.parentElement;
            popup.innerHTML = '';
            popup.style.visibility = "visible";
            popup.appendChild(createElement("a", "header", "Removing..."));
            const removeFunc = () => {
                options.style.visibility = "visible";
                options.innerHTML = '';
                options.appendChild(createElement("a", "header", "Removed"));
                options.appendChild(createButton("Undo", "button-green", () => {
                    options.parentElement.insertAdjacentElement('afterbegin', createFavoriteEntry(avatar));
                    options.parentNode.removeChild(card);
                }));
                popup.style.visibility = "hidden";
            };
            setTimeout(removeFunc, 5000);
            popup.appendChild(createButton("Cancel", "button-red", () => {
                popup.style.visibility = "hidden";
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
        doc.appendChild(createEntry(avtr.id, avtr.name, avtr.thumbnailImageUrl, avtr.releaseStatus, [
            createButton("Equip", "button-green", () => {

            }),
            createButton("Edit", "button-green", () => {

            }),
            createButton("Remove", "button-red", () => {

            }),
            createButton("Cancel", "button-red", () => {

            })
        ]));
    }
};

const createEntry = (id, name, image, status, extra) => {
    const entryContainer = createElement("div", "box card-entry-container");
    const entryOptions = createElement("div", "card-options");
    const entryDeleteTimeout = createElement("div", "card-options");
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


const createButton = (text, color, func) => {
    const div = createElement("div", "button " + color, text);
    div.addEventListener("click", func);
    return div;
};

renderFavorites(fakeJson);
renderAvatars(data);
finishLoading();