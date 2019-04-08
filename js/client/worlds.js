// search
const searchWorlds = getId("searchWorlds");
// spotlight
const spotlightWorlds = getId("spotlightWorlds");
const spotlightLoad = getId("spotlightLoad");
// active
let activePage = 0;
const activeWorlds = getId("activeWorlds");
const activeLoad = getId("activeLoad");
// popular
const popularWorlds = getId("popularWorlds");
const popularLoad = getId("popularLoad");
// avatar
const avatarWorlds = getId("avatarWorlds");
const avatarLoad = getId("avatarLoad");
// new
const newWorlds = getId("newWorlds");
const newLoad = getId("newLoad");
// updated
const updatedWorlds = getId("updatedWorlds");
const updatedLoad = getId("updatedLoad");
// history
const historyWorlds = getId("historyWorlds");
const historyLoad = getId("historyLoad");
// mine
const myWorlds = getId("myWorlds");
const myLoad = getId("myLoad");
// community labs
const labsWorlds = getId("labsWorlds");
const labsLoad = getId("labsLoad");
// favorites
const favoriteWorlds = getId("favoriteWorlds");
const favoriteLoad = getId("favoriteLoad");

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

const createWorldEntry = (world, buttons) => {
    return createEntry(world.id, world.name, world.thumbnailImageUrl, world.releaseStatus, buttons)
};

const renderRow = (element, data, buttons) => {
    for (let i = 0; i < data.length; i++) {
        const wrld = data[i];
        element.appendChild(createWorldEntry(wrld, buttons));
    }
};

activeLoad.addEventListener("click", () => {
    load();
    disableDiv(activeLoad);
    getWorlds({active: true, offset: activePage}, (data) => {
        stopLoading();
        if (data.error === undefined) {
            renderRow(activeWorlds, data, undefined);
            const parent = activeLoad.parentElement;
            activeWorlds.appendChild(parent);
            activePage += 10;
            blinkGreen();
        } else {
            blinkRed();
            sendNotification("Error", data.error.message, getIconFor("error"));
        }
        enableDiv(activeLoad);
    })
});

finishLoading();