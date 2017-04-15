var addFunctionOnWindowLoad = function (callback) {
    if (window.addEventListener) {
        window.addEventListener('load', callback, false);
    } else {
        window.attachEvent('onload', callback);
    }
};

addFunctionOnWindowLoad(xxx);

function xxx() {
    document.getElementById("XXX").onmouseover = xxxxx;
}

function xxxxx() {
    if (xxx.selectedIndex == 0) {
        document.getElementById("xxxx").style.display = "inline";
        document.getElementById("xxxx").innerHTML = "text";
    }
}