const userData = JSON.parse(localStorage.getItem("userData"));

getId("user-name").innerText = userData.username;
getId("display-name").innerText = userData.displayName;
getId("user-id").innerText = userData.id;
getId("avatar-image").src = userData.currentAvatarThumbnailImageUrl;
getId("status").value = userData.statusDescription;

const tags = userData.tags;

let trust_level = 0;

if (tags === undefined) {
    trust_level = 0;
} else {
    // Nuisance
    trust_level = tags.indexOf("system_troll") > -1 ? -2 :
        // Troll
        trust_level = tags.indexOf("system_probable_troll") > -1 ? -1 :
            // Veteran a.k.a Legend
            trust_level = tags.indexOf("system_trust_legend") > -1 ? 5 :
                // Trusted
                trust_level = tags.indexOf("system_trust_veteran") > -1 ? 4 :
                    // Known
                    trust_level = tags.indexOf("system_trust_trusted") > -1 ? 3 :
                        // User
                        trust_level = tags.indexOf("system_trust_known") > -1 ? 2 :
                            // Visitor
                            trust_level = tags.indexOf("system_trust_basic") > -1 ? 1 : 0;
}

const trustMeterShrinker = getId("trustBarShrink");
const trustBar = getId("trustBar");
const trustImage = getId("trustImage");
const trustInfo = getId("trustInfo");


switch (trust_level) {
    case -2: {
        trustMeterShrinker.style.width = "100%";
        trustImage.setAttribute("src", "../css/images/trust/0.png");
        trustInfo.innerText = "Nuisance";
        trustMeterShrinker.style.width = "0";
        trustBar.style.backgroundColor = "#ff2328";
        break;
    }
    case -1: {
        trustMeterShrinker.style.width = "50%";
        trustImage.setAttribute("src", "../css/images/trust/1.png");
        trustInfo.innerText = "Troll";
        trustBar.style.backgroundColor = "#ff2328";
        break;
    }
    case 0: {
        trustMeterShrinker.style.width = "83%";
        trustImage.setAttribute("src", "../css/images/trust/2.png");
        trustInfo.innerText = "Visitor";
        trustBar.style.backgroundColor = "#cccccc";
        break;
    }
    case 1: {
        trustMeterShrinker.style.width = "66.4%";
        trustImage.setAttribute("src", "../css/images/trust/3.png");
        trustInfo.innerText = "New User";
        trustBar.style.backgroundColor = "#1778ff";
        break;
    }
    case 2: {
        trustMeterShrinker.style.width = "49.8%";
        trustImage.setAttribute("src", "../css/images/trust/4.png");
        trustInfo.innerText = "User";
        trustBar.style.backgroundColor = "#2bcf5c";
        break;
    }
    case 3: {
        trustMeterShrinker.style.width = "33.2%";
        trustInfo.innerText = "Known User";
        trustImage.setAttribute("src", "../css/images/trust/5.png");
        trustBar.style.backgroundColor = "#ff7b42";
        break;
    }
    case 4: {
        trustMeterShrinker.style.width = "16.6%";
        trustInfo.innerText = "Trusted User";
        trustImage.setAttribute("src", "../css/images/trust/6.png");
        trustBar.style.backgroundColor = "#8143e6";
        break;
    }
    case 5: {
        trustMeterShrinker.style.width = "0";
        trustInfo.innerText = "Veteran";
        trustImage.setAttribute("src", "../css/images/trust/7.png");
        trustBar.style.backgroundColor = "#ffff00";
        break;
    }
}

console.log(trust_level);