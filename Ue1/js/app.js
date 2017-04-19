function imageevent() {
    document.getElementById("image1").addEventListener("mouseover", showButtons, true);
    // document.getElementById("image1").addEventListener("mouseout", hideButtons, true);
    document.getElementById("likebutton").addEventListener("click", setStatus, true);
    document.getElementById("detailbutton").addEventListener("click", openModal, true);

    // modal
    document.getElementsByClassName("close")[0].addEventListener("click", closeModal, true);
}

var addFunctionOnWindowLoad = function (callback) {
    if (window.addEventListener) {
        window.addEventListener('load', callback, false);
    } else {
        window.attachEvent('onload', callback);
    }
}

addFunctionOnWindowLoad(imageevent);

function showButtons(image1) {
    document.getElementById("image1").style.opacity = "0.5";
    document.getElementById("likebutton").style.visibility = "visible";
    document.getElementById("detailbutton").style.visibility = "visible";
    }

/**
function hideButtons(image1) {
    document.getElementById("image1").style.opacity = "1";
    document.getElementById("likebutton").style.visibility = "hidden";
    document.getElementById("detailbutton").style.visibility = "hidden";
}
 **/

function setStatus(likebutton) {
    document.getElementById("likebutton").style.backgroundColor = "red";
    document.getElementById("likebutton").innerHTML = "gefällt mir!";
}

function openModal(myModal){
    document.getElementById("myModal").style.display = "block";
}

function closeModal(myModal){
    document.getElementById("myModal").style.display = "none";
}










/**
window.addEventListener("load", function (event) {
    
    var pics = document.getElementsByTagName("img");
    var picture_button_frames = document.getElementsByClassName("picture-button-frame");
    var like_buttons = document.getElementsByClassName("like-button");
    var detail_buttons = document.getElementsByClassName("detail-button");
    
    for (var i = 0; i < pics.length; i++) {
        var pic = pics[i];
        
        // … find button objects and add listener …
        pic.addEventListener("mouseover", function (event) {
            picture_button_frames.style.display = "block";
            alert("asdasd");
        });
        likeButton.addEventListener("click", function (event) {
            like_buttons.style.display = "Gef&auml;llt dir";
        });
        detailButton.addEventListener("click", function (event) {
            detail_buttons.style.display = "Gef&auml;llt dir";
        });
    }
});
 **/

/**
window.onload = function () {
    var picture_frames = document.getElementsByClassName("picture-frame");
    var picture_button_frames = document.getElementsByClassName("picture-button-frame");
    var like_buttons = document.getElementsByClassName("like-button");

    for (var i = 0; i < picture_frames.length; i++) {
        var pic = picture_frames[i];
        
        (function() {
            picture_frames[i].addEventListener("mouseover", showButtons(pic), false);
            picture_frames[i].addEventListener("mouseout", hideButtons(pic), false);
            like_buttons[i].addEventListener("click", pressLikeButton(pic), false);
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
**/