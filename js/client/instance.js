const worldId = getParameterByName("worldId", document.location);
const otherId = getParameterByName("otherId", document.location);

if (worldId !== null && otherId !== null) {
    getWorldInstance(worldId, otherId, (data) => {
        document.getElementById("joinButton").addEventListener("click", () => {
            console.log("vrchat://launch?id=" + worldId + ":" + otherId);
            document.location = "vrchat://launch?id=" + worldId + ":" + otherId;
        });
        const userList = getId("userList");
        let owner = undefined;
        for (let i = 0; i < data.users.length; i++) {
            const user = data.users[i];
            if (user.id === data.hidden || user.id === data.private || user.id === data.friends) {
                owner = user;
            }
            const div = createElement("div", "user-list-entry");
            const a = createElement("a");
            a.style.color = trustRankToColor(tagsToTrustRank(user.tags));
            a.innerText = user.displayName;
            div.appendChild(a);
            userList.appendChild(div);
        }

        if (owner !== undefined) {
            getId("ownerName").innerText = owner.displayName;
            getId("ownerName").style.color = trustRankToColor(tagsToTrustRank(owner.tags));
            getId("ownerImage").src = owner.currentAvatarThumbnailImageUrl;
        }
        finishLoading();
    });
}

document.getElementById("backButton").addEventListener("click", () => {
    navToPage("friends", "?cache=1");
});