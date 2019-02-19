function sendNotification(title, body, image, callback) {
    const options = {
        body: body
    };
    if (image !== undefined) {
        options.icon = image;
    }
    let notify = new Notification(title, options);
    notify.onclick = callback;
}

// TODO proper icons and copyright
const getIconFor = (name) => {
    switch (name) {
        case "info": return "https://i.imgur.com/YFPOhDF.png";
        case "debug": return "https://i.imgur.com/vdhVjqM.png";
        case "ok": return "https://i.imgur.com/AnnlrPF.png";
        default: return;
    }
};

const println = (message) => {
    console.log(message);
};