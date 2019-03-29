const renderFavorites = (data) => {
    const doc = document.getElementById("favoriteAvatars");
    for (let i = 0; i < data.length; i++) {
        const avtr = data[i];
        doc.appendChild(createFavoriteEntry(avtr));
    }
};

const createFavoriteEntry = (avatar) => {
    return createEntry(avatar.id, avatar.name, avatar.thumbnailImageUrl, avatar.releaseStatus, [
        createButton("Equip", "button-green", () => {

        }),
        createButton("View author", "button-green", () => {

        }),
        createButton("Keepsake", "button-green", () => {
            // TODO spaghetti
            const localStorage = window.localStorage;
            // I'd like to personally apologize to anyone who reads my code
            localStorage.setItem("keepsakes", JSON.stringify(JSON.parse(localStorage.getItem("keepsakes")).push(avatar)));

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
                    card.parentElement.insertAdjacentElement('afterbegin', createFavoriteEntry(avatar));
                    card.parentNode.removeChild(card);
                    clearInterval(progressBar);
                }));
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
    ])
};

const renderAvatars = (data) => {
    const doc = document.getElementById("privateAvatars");
    for (let i = 0; i < data.length; i++) {
        const avtr = data[i];
        doc.appendChild(createPrivateEntry(avtr));
    }
};


const createPrivateEntry = (avatar) => {
    return createEntry(avatar.id, avatar.name, avatar.thumbnailImageUrl, avatar.releaseStatus, [
        createButton("Equip", "button-green", () => {

        }),
        createButton("Edit", "button-green", () => {

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
                // TODO remove avatar
                card.parentNode.removeChild(card);
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

renderFavorites(fakeJson);
renderAvatars(data);
finishLoading();