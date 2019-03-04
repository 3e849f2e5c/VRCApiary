const userData = JSON.parse(localStorage.getItem("userData"));

getId("user-name").innerText = userData.username;
getId("display-name").innerText = userData.displayName;
getId("user-id").innerText = userData.id;
getId("avatar-image").src = userData.currentAvatarThumbnailImageUrl;
getId("status").src = userData.statusDescription;