let pos = 0;
let interval;

const blinkRed = () => {
    const fg = statusBarFg();
    fg.style.opacity = "1";
    fg.style.backgroundColor = "red";
    setTimeout(() => {
        fg.style.backgroundColor = "grey";
    }, 200);
    setTimeout(() => {
        fg.style.backgroundColor = "red";
    }, 400);
    setTimeout(() => {
        fg.style.backgroundColor = "grey";
    }, 600);
    setTimeout(() => {
        fg.style.backgroundColor = "red";
    }, 800);
    setTimeout(() => {
        fg.style.backgroundColor = "grey";
        fg.style.opacity = "0";
    }, 1000);
};

const blinkGreen = () => {
    const fg = statusBarFg();
    fg.style.opacity = "1";
    fg.style.backgroundColor = "lime";
    setTimeout(() => {
        fg.style.backgroundColor = "grey";
        fg.style.opacity = "0";
    }, 1000);
};

const load = () => {
    if (interval !== undefined) {
        return;
    }
    const bg = statusBarBg();
    bg.style.opacity = "1";
    interval = setInterval(increase, 100);
};

const stopLoading = () => {
    const bg = statusBarBg();
    bg.style.opacity = "0";
    pos = 0;
    bg.style.backgroundPositionX = "0";
    clearInterval(interval);
    interval = undefined;
};

const increase = () => {
    const bg = statusBarBg();
    bg.style.backgroundPositionX = pos + "%";
    pos++;
};

const blink = (color) => {

};

const statusBar = () => {
    return document.getElementById("statusBar");
};

const statusBarBg = () => {
    return document.getElementById("statusBarBg");
};

const statusBarFg = () => {
    return document.getElementById("statusBarColor");
};

const statusBarFiller = () => {
    return document.getElementById("statusBarFiller");
};