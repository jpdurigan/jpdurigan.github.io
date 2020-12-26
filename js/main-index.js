const popup = $("#bio-popup");

function togglePopup() {
    if (popup.is(":visible")) {
        popup.fadeOut();
    } else {
        popup.fadeIn();
    };
}