// Register, load, parse events/eventlistener.
var addFunctionOnWindowDOMContentLoaded = function (callback) {
    if (window.addEventListener) {
        // DOMContentLoaded: Will load Javascript after DOM is fully loaded and parsed.
        window.addEventListener('DOMContentLoaded', callback, false);
    } else {
        // Register Eventhandlers
        window.attachEvent('onload', callback);
    }
};

// Add functions, will be loaded ordered from top to bottom.
addFunctionOnWindowDOMContentLoaded(imageevent);

/**
 * Contains all imageevent listeners of the articles.
 */
function imageevent() {

    // Get image elements.
    var pics = document.getElementsByClassName("gallery");

    for (var i = 0; i < pics.length; i++) {

        (/**
         * Eventlisteners are described here.
         * Closure function to hide its functionality as a blackbox.
         * Also used this function to get access to the i parameter.
         *
         * @param i The classnumber of the activated element.
         */
            function (i) {

            // get additional elements.
            var pic = pics[i];
            var modalpic = document.getElementsByClassName("modalgallery")[i];
            var like = document.getElementsByClassName("likebutton")[i];
            var likestatus = document.getElementsByClassName("likestatus")[i];
            var dislikestatus = document.getElementsByClassName("dislikestatus")[i];
            var detail = document.getElementsByClassName("detailbutton")[i];
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
            var modheader = document.getElementsByClassName("modalheader")[0];

            // opens modal by clicking the detailbutton. Adds the chosen image to the modal.
            detail.addEventListener("click", function showModalpic() {
                openmod.style.display = "block";
                modheader.style.display = "block";

                pic.style.position = "absolute";
                pic.style.marginRight = "auto";
                pic.style.marginLeft = "auto";
                pic.style.marginTop = "50px";
                pic.style.top = "0";
                pic.style.left = "0";
                pic.style.right = "0";
                pic.style.maxWidth = "100%";
                pic.style.maxHeight = "100%";
                pic.style.zIndex = "102";
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
                modheader.style.display = "none";

                pic.style.position = "static";
                pic.style.maxWidth = "236px";
                pic.style.zIndex = "0";
            }, false);
        })(i);
    }
}