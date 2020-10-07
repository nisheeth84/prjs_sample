var CONST = {
    BTN_SUBMIT_FORM_ID: "#btnSubmitForm",
    FORM_LOGIN_ID: '#formLogin',
};

$(CONST.BTN_SUBMIT_FORM_ID).click(function (event) {
    // Fetch form to apply custom Bootstrap validation
    let form = $(CONST.FORM_LOGIN_ID);

    if (form[0].checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }

    form.addClass('was-validated');
});
