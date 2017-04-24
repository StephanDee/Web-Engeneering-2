// Adds additional window.onload events.
var addFunctionOnWindowLoad = function (callback) {
    if (window.addEventListener) {
        window.addEventListener('load', callback, false);
    } else {
        window.attachEvent('onload', callback);
    }
};

// Add functions, will be loaded ordered from top to bottom.
addFunctionOnWindowLoad(imageevent);

/**
 * Contains all imageevent listeners of the articles.
 */
function imageevent() {
    var pics = document.getElementsByClassName("gallery");
    var modalpics = document.getElementsByClassName("modalgallery");
    var likes = document.getElementsByClassName("likebutton");
    var likesstatus = document.getElementsByClassName("likestatus");
    var dislikesstatus = document.getElementsByClassName("dislikestatus");
    var details = document.getElementsByClassName("detailbutton");

    for (var i = 0; i < pics.length; i++) {

        (/**
         * Eventlisteners are described here.
         * Closure function to hide its functionality as a blackbox.
         * Also used this function to get access to the i parameter.
         *
         * @param i The classnumber of the activated element.
         */
            function (i) {
            var pic = pics[i];
            var modalpic = modalpics[i];
            var like = likes[i];
            var likestatus = likesstatus[i];
            var dislikestatus = dislikesstatus[i];
            var detail = details[i];
            var flag = true;

            // Buttons, shadow appear by image mouseover.
            pic.addEventListener("mouseover", function showButtons() {
                pic.style.boxShadow = "0 0 4px red";
                like.style.visibility = "visible";
                detail.style.visibility = "visible";
            }, false);

            // shadow disappears by image mouseout.
            pic.addEventListener("mouseout", function picOut() {
                pic.style.boxShadow = "none";
            }, false);

            // Thumb up, thumb down appears by clicking likebutton with additional features.
            like.addEventListener("click", function setStatus() {
                if (flag === true) {
                    flag = false;
                    like.style.backgroundColor = "firebrick";
                    like.innerHTML = "Dislike";
                    likestatus.style.width = "20px";
                    dislikestatus.style.width = "0";
                } else {
                    flag = true;
                    like.style.backgroundColor = "dodgerblue";
                    like.innerHTML = "Like";
                    likestatus.style.width = "0";
                    dislikestatus.style.width = "20px";
                }
            }, false);

            // shadow appears by likebutton mouseover.
            like.addEventListener("mouseover", function hoverLike() {
                like.style.boxShadow = "0px 0px 4px red";
            }, false);

            // shadow disappears by likebutton mouseout.
            like.addEventListener("mouseout", function hoverOutLike() {
                like.style.boxShadow = "none";
            }, false);

            // open modal
            var openmod = document.getElementsByClassName("modal")[0];

            // opens modal by clicking the detailbutton. Adds the chosen image to the modal.
            detail.addEventListener("click", function showModalpic() {
                modalpic.style.maxWidth = "100%";
                openmod.style.display = "block";
            }, false);

            // shadow appears by detailbutton mouseover.
            detail.addEventListener("mouseover", function hoverDetail() {
                detail.style.boxShadow = "0px 0px 4px red";
            }, false);

            // shadow disappears by detailbutton mouseout.
            detail.addEventListener("mouseout", function hoverOutDetail() {
                detail.style.boxShadow = "none";
            }, false);

            // close modal
            var closemod = document.getElementsByClassName("close")[0];

            // closes modal by clicking the closebutton. Removes the image from the modal.
            closemod.addEventListener("click", function closeModal() {
                openmod.style.display = "none";
                modalpic.style.maxWidth = "0";
            }, false);
        })(i);
    }
}