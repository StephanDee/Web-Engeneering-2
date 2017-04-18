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
        document.getElementById("xxxx").innerHTML = "text-test";
    }
}

window.onload = function () {
    var picture_frames = document.getElementsByClassName("picture-frame");
    var picture_button_frames = document.getElementsByClassName("picture-button-frame");
    var like_buttons = document.getElementsByClassName("like-button");

    for (var i = 0; i < picture_frames.length; i++) {
        (function() {
            picture_frames[i].addEventListener("mouseover", showButtons(picture_button_frames[i]), false);
            picture_frames[i].addEventListener("mouseout", hideButtons(picture_button_frames[i]), false);
            like_buttons[i].addEventListener("click", pressLikeButton(like_buttons[i]), false);
        })()
    }

}

function pressLikeButton(like_button) {
    like_button.style.display = "Gef&auml;llt dir";
}

function showButtons(button_frame) {
    button_frame.style.display = "block";
}

function hideButtons(button_frame) {
    button_frame.style.display = "none";
}