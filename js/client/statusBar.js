let pos = 0;
let interval;

function blinkRed() {
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
}

function blinkGreen() {
    const fg = statusBarFg();
    fg.style.opacity = "1";
    fg.style.backgroundColor = "lime";
    setTimeout(() => {
        fg.style.backgroundColor = "grey";
        fg.style.opacity = "0";
    }, 1000);
}

function load() {
    if (interval !== undefined) {
        return;
    }
    const bg = statusBarBg();
    bg.style.opacity = "1";
    interval = setInterval(increase, 100);
}

function stopLoading() {
    const bg = statusBarBg();
    bg.style.opacity = "0";
    pos = 0;
    bg.style.backgroundPositionX = "0";
    clearInterval(interval);
    interval = undefined;
}

function increase() {
    const bg = statusBarBg();
    bg.style.backgroundPositionX = pos + "%";
    pos++;
}

function blink(color) {

}

function statusBar() {
    return document.getElementById("statusBar");
}

function statusBarBg() {
    return document.getElementById("statusBarBg");
}

function statusBarFg() {
    return document.getElementById("statusBarColor");
}

function statusBarFiller() {
    return document.getElementById("statusBarFiller");
}