

const renderFavorites = (data) => {
    const doc = document.getElementById("favoriteAvatars");
    for (let i = 0; i < data.length; i++) {
        const avtr = data[i];
        doc.appendChild(createEntry(avtr.id, avtr.name, avtr.thumbnailImageUrl, avtr.releaseStatus, [
            "Avatar by",
            avtr.authorName
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

const createEntry = (id, name, image, status, description) => {
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
    if (description !== undefined && description.length !== 0) {
        const desc = createElement("div", "card-description-container");
        for (let i = 0; i < description.length; i++) {
            const a = createElement("a", "", description[i]);
            if (description[i] === "Avatar by") {
                a.style.fontSize = "20px";
            }
            desc.appendChild(a);
        }
        entryContainer.appendChild(desc);
    }
    return entryContainer;
};

renderFavorites(fakeJson);
renderAvatars(data);
finishLoading();