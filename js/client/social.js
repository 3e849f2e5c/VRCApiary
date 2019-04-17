const searchField = getId("searchInput");
const list = getId("socialList");

searchField.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && searchField.classList.contains("disabled") === false) {
        if (searchField.value !== "") {
            disableDiv(searchField);
            load();
            getUsers({search: encodeURIComponent(searchField.value), amount: 25}, (data) => {
                stopLoading();
                enableDiv(searchField);
                if (data.error === undefined) {
                    window.localStorage.setItem("cachedSocial", JSON.stringify(data));
                    blinkGreen();
                    renderSocial(data);
                } else {
                    blinkRed();
                    sendError(data, "VRChat API")
                }
            });
        }
    }
});

const renderSocial = (data) => {
    list.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const fr = data[i];
        list.appendChild(createSocialEntry(fr));
    }
};

const createSocialEntry = (fr) => {
    const entryContainer = createElement("div", "box card-entry-container offline-entry");
    const entryOptions = createElement("div", "card-options");
    const entryMessage = createElement("div", "card-options message-popup");
    const friendProfileContainer = createElement("div", "friend-profile-container");
    const friendName = createElement("a", "friend-name", fr.displayName);
    const friendImage = createElement("img", "friend-image");

    const optionName = createElement("a", "header", fr.displayName);
    entryOptions.appendChild(optionName);
    entryOptions.appendChild(createButton("Profile", "button-green", (e) => {
        window.localStorage.setItem("oldScroll", window.pageYOffset.toString());
        navWithBacktags("profile", "?u=" + fr.id,"social", "?cache=1");
    }));

    friendProfileContainer.title = fr.username;
    friendProfileContainer.style.marginBottom = "8px";

    entryOptions.appendChild(createButton("Cancel", "button-red", () => {
        entryOptions.style.visibility = "hidden";
    }));
    entryContainer.appendChild(entryOptions);
    entryContainer.appendChild(entryMessage);
    friendProfileContainer.addEventListener("click", () => {
        entryOptions.style.visibility = "visible";
    });
    friendImage.setAttribute("src", fr.currentAvatarThumbnailImageUrl);

    const trustColor = trustRankToColor(tagsToTrustRank(fr.tags));
    friendName.style.color = trustColor;
    optionName.style.color = trustColor;

    friendProfileContainer.appendChild(friendName);
    friendProfileContainer.appendChild(friendImage);
    entryContainer.appendChild(friendProfileContainer);
    return entryContainer;
};

if (getParameterByName("cache") === "1") {
    renderSocial(JSON.parse(window.localStorage.getItem("cachedSocial")));
    window.scrollTo(0, parseInt(window.localStorage.getItem("oldScroll")));
}

finishLoading();