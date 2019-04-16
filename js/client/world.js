const renderPage = (world) => {

    renderWorlds(world);

    getId("world-name").innerText = world.name;
    getId("world-owner-name").innerText = world.authorName;
    getId("world-id").innerText = world.id;
    getId("avatar-image").src = world.thumbnailImageUrl;
    if (world.description !== undefined) {
        if (world.description === "") {
            getId("status").innerText = "None";
        } else {
            getId("status").innerText = world.description;
        }
    }

    if (world.releaseStatus !== undefined) {
        switch (world.releaseStatus) {
            case "public": {
                if (world.tags.indexOf("system_labs")) {
                    getId("avatar-image").setAttribute("style", "border-color: green;");
                } else {
                    getId("avatar-image").setAttribute("style", "border-color: aqua;");
                }
                break;
            }
            case "private": {
                getId("avatar-image").setAttribute("style", "border-color: red;");
                break;
            }
        }
    }

    // const trustMeterShrinker = getId("trustBarShrink");
    // const trustBar = getId("trustBar");
    // const trustImage = getId("trustImage");
    // const trustInfo = getId("trustInfo");
    //
    // switch (tagsToTrustRank(world.tags)) {
    //     case -2: {
    //         trustMeterShrinker.style.width = "100%";
    //         trustImage.setAttribute("src", "../css/images/trust/0.png");
    //         trustInfo.innerText = "Nuisance";
    //         trustMeterShrinker.style.width = "0";
    //         trustBar.style.backgroundColor = "#ff2328";
    //         break;
    //     }
    //     case -1: {
    //         trustMeterShrinker.style.width = "50%";
    //         trustImage.setAttribute("src", "../css/images/trust/1.png");
    //         trustInfo.innerText = "Troll";
    //         trustBar.style.backgroundColor = "#ff2328";
    //         break;
    //     }
    //     case 0: {
    //         trustMeterShrinker.style.width = "83%";
    //         trustImage.setAttribute("src", "../css/images/trust/2.png");
    //         trustInfo.innerText = "Visitor";
    //         trustBar.style.backgroundColor = "#cccccc";
    //         break;
    //     }
    //     case 1: {
    //         trustMeterShrinker.style.width = "66.4%";
    //         trustImage.setAttribute("src", "../css/images/trust/3.png");
    //         trustInfo.innerText = "New User";
    //         trustBar.style.backgroundColor = "#1778ff";
    //         break;
    //     }
    //     case 2: {
    //         trustMeterShrinker.style.width = "49.8%";
    //         trustImage.setAttribute("src", "../css/images/trust/4.png");
    //         trustInfo.innerText = "User";
    //         trustBar.style.backgroundColor = "#2bcf5c";
    //         break;
    //     }
    //     case 3: {
    //         trustMeterShrinker.style.width = "33.2%";
    //         trustInfo.innerText = "Known User";
    //         trustImage.setAttribute("src", "../css/images/trust/5.png");
    //         trustBar.style.backgroundColor = "#ff7b42";
    //         break;
    //     }
    //     case 4: {
    //         trustMeterShrinker.style.width = "16.6%";
    //         trustInfo.innerText = "Trusted User";
    //         trustImage.setAttribute("src", "../css/images/trust/6.png");
    //         trustBar.style.backgroundColor = "#8143e6";
    //         break;
    //     }
    //     case 5: {
    //         trustMeterShrinker.style.width = "0";
    //         trustInfo.innerText = "Veteran";
    //         trustImage.setAttribute("src", "../css/images/trust/7.png");
    //         trustBar.style.backgroundColor = "#ffff00";
    //         break;
    //     }
    // }
    const btn = getId("buttons");

    btn.appendChild(createButton("Back", "button-red", (e) => {
        navToPage(getParameterByName("back", document.location), decodeURIComponent(getParameterByName("backtags", document.location)));
    }));
    finishLoading();
};

const renderWorlds = (data) => {
    const doc = document.getElementById("worldInstances");
    for (let i = 0; i < data.instances.length; i++) {
        const instance = data[i];
        doc.appendChild(createWorldEntry(data));
    }
};

const createWorldEntry = (world) => {
    return createEntry(world.id, world.name, world.thumbnailImageUrl, world.releaseStatus, [
        createButton("Join", "button-green disabled", () => {

        }),
        createButton("Invite friends", "button-green", () => {

        }),
        createButton("Preview", "button-green", () => {

        }),
        createButton("Cancel", "button-red", () => {

        })
    ])
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

getWorld(getParameterByName("w", document.location), (data) => {
    renderPage(data);
});

