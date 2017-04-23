var addFunctionOnWindowLoad = function (callback) {
    if (window.addEventListener) {
        window.addEventListener('load', callback, false);
    } else {
        window.attachEvent('onload', callback);
    }
}

addFunctionOnWindowLoad(imageevent);

function imageevent() {
    var pics = document.getElementsByClassName("gallery");
    var likes = document.getElementsByClassName("likebutton");
    var details = document.getElementsByClassName("detailbutton");

    for (var i = 0; i < pics.length; i++) {

        (function (i) {
            var pic = pics[i];
            var like = likes[i];
            var detail = details[i];

            pic.addEventListener("mouseover", function showButtons(event) {
                pics[i].style.opacity = "0.5";
                likes[i].style.visibility = "visible";
                details[i].style.visibility = "visible";
            }, false);

            // pic.addEventListener("mouseout", hideButtons, true);

            like.addEventListener("click", function setStatus(event) {
                likes[i].style.backgroundColor = "red";
                likes[i].innerHTML = "gefällt mir!";
            }, false);

            detail.addEventListener("click", openModal, false);

            // modal
            document.getElementsByClassName("close")[0].addEventListener("click", closeModal, true);
        })(i);
    }
}

function openModal(myModal) {
    document.getElementById("myModal").style.display = "block";
}

function closeModal(myModal) {
    document.getElementById("myModal").style.display = "none";
}

// function showButtons(gallery) {
//     // this. -> img event
//     pics[i].style.opacity = "0.5";
//     likes[i].style.visibility = "visible";
//     details[i].style.visibility = "visible";
//     }
//
// /**
// function hideButtons(gallery) {
//     pics[0].style.opacity = "1";
//     likes[0].style.visibility = "hidden";
//     detail[0].style.visibility = "hidden";
// }
//  **/
//
// function setStatus(likebutton) {
//     likes[i].style.backgroundColor = "red";
//     likes[i].innerHTML = "gefällt mir!";
// }