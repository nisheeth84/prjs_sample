const CONST_MAIN = {
    SELECT_ALL_ID: "#select-all",
    MENU_TOGGLE_ID: "#toggle",
    WRAPPER_ID: "#wrapper",
    CHECK_BOX_ID: ":checkbox"
};

// Listen for click on toggle checkbox table data
$(CONST_MAIN.SELECT_ALL_ID).click(function (event) {
    if (this.checked) {
        // Iterate each checkbox
        $(CONST_MAIN.CHECK_BOX_ID).each(function () {
            this.checked = true;
        });
    } else {
        $(CONST_MAIN.CHECK_BOX_ID).each(function () {
            this.checked = false;
        });
    }
});

<!-- Menu Toggle Script -->
$(CONST_MAIN.MENU_TOGGLE_ID).click(function (e) {
    e.preventDefault();
    $(CONST_MAIN.WRAPPER_ID).toggleClass("toggled")
});