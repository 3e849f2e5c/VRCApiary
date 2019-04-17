const renderPage = (world) => {

    renderWorlds(world);

    getId("world-name").innerText = world.name;
    getId("world-owner-name").innerText = world.authorName;
    getId("world-id").innerText = world.id;
    getId("avatar-image").src = world.thumbnailImageUrl;
    if (world.description !== undefined) {
        if (world.description === "") {
            getId("description").innerText = "None";
        } else {
            getId("description").innerText = world.description;
        }
    }

    try {
        getId("status").innerText = ("" + world.visits).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    } catch (e) {
        sendError({error:{message:"Parsing error: " + e.message}}, "VRCApiary");
    }

    if (world.releaseStatus !== undefined) {
        switch (world.releaseStatus) {
            case "public": {
                if (world.tags.indexOf("system_labs") !== -1) {
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
    const btn = getId("buttons");

    btn.appendChild(createButton("Back", "button-red", (e) => {
        goBack();
    }));
    finishLoading();
};

const renderWorlds = (data) => {
    const doc = document.getElementById("worldInstances");
    for (let i = 0; i < data.instances.length; i++) {
        const instance = data.instances[i];
        doc.appendChild(createWorldEntry(instance, data));
    }
};

const createWorldEntry = (instance, world) => {
    return createEntry(world.id, instance[1].toString() + "/" + world.capacity, world.thumbnailImageUrl, world.releaseStatus, "#" + instance[0], [
        createButton("Join", "button-green", () => {
            joinWorld(world.id + ":" + instance[0].toString());
        }),
        createButton("Invite friends", "button-green", () => {

        }),
        createButton("Preview", "button-green", () => {
            navWithBacktags("instance", "?worldId=" + world.id + "&otherId=" + instance[0].toString(), "world", "?w=" + world.id.toString());
        }),
        createButton("Cancel", "button-red", () => {

        })
    ])
};

const createEntry = (id, name, image, status, capacity, extra) => {
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
    avatarContainer.setAttribute("title", capacity);
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

