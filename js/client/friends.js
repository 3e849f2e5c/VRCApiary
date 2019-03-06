

let list = getId("friendsList");

const worldsToLoad = [];

for (let i = 0; i < fakeJson.length; i++) {
    const fr = fakeJson[i];
    let was = false;
    for (let j = 0; j < worldsToLoad.length; j++) {
        const wrld = worldsToLoad[j];
        if (wrld.world === fr.location) {
            was = true;
        }
    }

    if (was === false && fr.location !== "private") {
        worldsToLoad.push({world: fr.location, functions: []});
    }
}

for (let i = 0; i < fakeJson.length; i++) {
    const fr = fakeJson[i];
    const entryContainer = createElement("div", "box friend-entry-container");
    const friendName = createElement("a", "friend-name", fr.displayName);
    const friendImage = createElement("img", "friend-image");
    const friendWorld = createElement("a", "friend-world");
    friendImage.setAttribute("src", fr.currentAvatarThumbnailImageUrl);
    let status;
    switch (fr.status) {
        case "active":
            status = "green";
            break;
        case "join me":
            status = "aqua";
            break;
        case "busy":
            status = "red";
            break;
        default:
            status = "white";
    }
    friendImage.setAttribute("style", "border-color: " + status);
    if (fr.location === "private") {
        friendWorld.innerText = "Private World";
    } else {
        for (let j = 0; j < worldsToLoad.length; j++) {
            const wrld = worldsToLoad[j];
            if (wrld === fr.location) {
                wrld.functions.push((worldName) => {
                    friendWorld.innerText = worldName;
                });
            }
        }
    }
    entryContainer.appendChild(friendName);
    entryContainer.appendChild(friendImage);
    list.appendChild(entryContainer);
}

// TODO
// let amount = 0;
// const loadWorld = (worldId, callback) => {
//     console.log("1");
//     if (worldsToLoad.length <= amount) {
//         amount += 1;
//     }
//     callback("1");
// };
//
//
// if (worldsToLoad.length !== 0) {
//     loadWorld(worldsToLoad[0], () => {
//
//     });
// }



