var addFunctionOnWindowLoad = function (callback) {
    if (window.addEventListener) {
        window.addEventListener('load', callback, false);
    } else {
        window.attachEvent('onload', callback);
    }
};

addFunctionOnWindowLoad(imageevent);

function imageevent() {
    var pics = document.getElementsByClassName("gallery");
    var modalpics = document.getElementsByClassName("modalgallery");
    var likes = document.getElementsByClassName("likebutton");
    var details = document.getElementsByClassName("detailbutton");

    for (var i = 0; i < pics.length; i++) {

        (function (i) {
            var pic = pics[i];
            var modalpic = modalpics[i];
            var like = likes[i];
            var detail = details[i];
            var flag = true;

            pic.addEventListener("mouseover", function showButtons() {
                pic.style.boxShadow = "0 0 4px red";
                like.style.visibility = "visible";
                detail.style.visibility = "visible";
            }, false);

            pic.addEventListener("mouseout", function picOut() {
                pic.style.boxShadow = "none";
            }, false);

            like.addEventListener("click", function setStatus() {
                if (flag === true) {
                    like.style.backgroundColor = "firebrick";
                    like.innerHTML = "not Like";
                    flag = false;
                } else {
                    like.style.backgroundColor = "dodgerblue";
                    like.innerHTML = "Like";
                    flag = true;
                }
            }, false);

            like.addEventListener("mouseover", function hoverLike() {
                like.style.boxShadow = "0px 0px 4px red";
            }, false);

            like.addEventListener("mouseout", function hoverOutLike() {
                like.style.boxShadow = "none";
            }, false);

            // open Modal
            var openmod = document.getElementById("myModal");

            detail.addEventListener("click", function showModalpic() {
                modalpic.style.visibility = "visible";
                openmod.style.display = "block";
            }, false);

            detail.addEventListener("mouseover", function hoverDetail() {
                detail.style.boxShadow = "0px 0px 4px red";
            }, false);

            detail.addEventListener("mouseout", function hoverOutDetail() {
                detail.style.boxShadow = "none";
            }, false);

            // close Modal
            var closemod = document.getElementsByClassName("close");

            closemod[0].addEventListener("click", function closeModal() {
                openmod.style.display = "none";
                modalpic.style.visibility = "hidden";
            }, false);
        })(i);
    }
}