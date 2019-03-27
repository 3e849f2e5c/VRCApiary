
const renderFavorites = (data) => {
    const doc = document.getElementById("favoriteAvatars");
    for (let i = 0; i < data.length; i++) {
        const avtr = data[i];
        doc.appendChild(createEntry(avtr.id, avtr.name, avtr.thumbnailImageUrl, avtr.releaseStatus, [
            createButton("Change", "button-green", () => {

            }),
            createButton("Remove", "button-red", () => {

            })
        ]));
    }
};

const renderAvatars = (data) => {
    const doc = document.getElementById("privateAvatars");
    for (let i = 0; i < data.length; i++) {
        const avtr = data[i];
        doc.appendChild(createEntry(avtr.id, avtr.name, avtr.thumbnailImageUrl, avtr.releaseStatus));
    }
};

const createEntry = (id, name, image, status, extra) => {
    const entryContainer = createElement("div", "box card-entry-container");
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
            if (typeof extra[i] !== "string") {
                entryContainer.appendChild(extra[i]);
            }
        }
    }
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