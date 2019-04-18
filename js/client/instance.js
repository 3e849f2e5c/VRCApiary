const worldId = getParameterByName("worldId", document.location);
const otherId = getParameterByName("otherId", document.location);

const tooltipSpan = document.getElementById('tooltip-span');

let offsetY = 20;
let offsetX = 20;

let lastX = 0;
let lastY = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === "Shift") {
        offsetX = -220;
        offsetY = -170;
        tooltipSpan.style.top = (lastY + offsetY) + 'px';
        tooltipSpan.style.left = (lastX + offsetX) + 'px';
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === "Shift") {
        offsetX = 20;
        offsetY = 20;
        tooltipSpan.style.top = (lastY + offsetY) + 'px';
        tooltipSpan.style.left = (lastX + offsetX) + 'px';
    }
});

window.onmousemove = function (e) {
    const x = e.clientX,
        y = e.clientY;
    lastX = x;
    lastY = y;
    tooltipSpan.style.top = (y + offsetY) + 'px';
    tooltipSpan.style.left = (x + offsetX) + 'px';
};

const renderPage = (data) => {
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
        a.addEventListener("mouseover", () => {
            getId("tooltip-image").src = user.currentAvatarThumbnailImageUrl;
            tooltipSpan.style.visibility = "visible";
        });
        a.addEventListener("mouseout", () => {
            getId("tooltip-image").src = "../css/images/loading.png";
            tooltipSpan.style.visibility = "hidden";
        });
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
};

if (worldId !== null && otherId !== null) {
    if (getParameterByName("cache", document.location) === "1") {
        renderPage(JSON.parse(window.localStorage.getItem("instanceCache")));
    } else {
        getWorldInstance(worldId, otherId, (data) => {
            renderPage(data);
        });
    }
}

document.getElementById("backButton").addEventListener("click", () => {
    if (getParameterByName("back", document.location) === null) {
        navToPage("friends", "?cache=1");
    } else {
        goBack();
    }
});