var importBtn;
var pageSize = 5;
var existEmail = false;
var CONST = {
    PAGING_ID: '#pagination',
    EMAIL_SPACE_MODAL_ID: '#emailModalSpace',
    BTN_EXPORT_ID: "#btnExport",
    BTN_BACKUP_ID: "#btnBackup",
    BTN_RELOAD_ID: "#btnReload",
    BTN_IMPORT_ID: "#real-file",
    BTN_SEARCH_ID: "#search",
    MODAL_TITLE_ID: "#modalTitle",
    BTN_SUBMIT_FORM_ID: "#btnSubmitForm",
    CREATE_STATUS_ID: "#createdStatus",
    PASSWORD_CONTAINER_ID: "#passwordContainer",
    UPDATE_STATUS_ID: "#updateStatus",
    F_ID: "#f-id",
    F_ACCOUNT_ID: "#f-accountId",
    CREATE_BY_ID: "#createdBy",
    STATUS_ID: "#status",
    UPDATED_BY_ID: "#updatedBy",
    LIST_ACCOUNT_ID: "#listAccounts",
    TOTAL_RECORD_ID: "#totalRecord",
    MODAL_ACCOUNT_ID: "#modalAccount",
    EMAIL_ID: "#email",
    PHONE_ID: "#phone",
    FULL_NAME_ID: "#fullname",
    SALT_ID: "#salt",
    PASSWORD_ID: "#password",
    FORM_ACCOUNT_ID: "#formAccount",
    MESSRES: "#messRes",
    TOGGLE_AREA_ID: '#toggleArea'
};
var importBtn;

function search() {
    let isSearchMode = true;
    let keyword = $(CONST.BTN_SEARCH_ID).val();
    let url = "./search?keyword=" + keyword;
    if (keyword.length === 0) {
        url = "./list";
    }
    loadData(url, 1, pageSize, isSearchMode);
}

$(document).ready(function () {
    $(CONST.BTN_EXPORT_ID).css("display", "none");
    $(CONST.BTN_BACKUP_ID).css("display", "none");
    $(CONST.BTN_RELOAD_ID).css("display", "none");
    importBtn = $(CONST.BTN_IMPORT_ID);
    importBtn.on('change', function () {
        importDataFromFile();
    });
    loadData("./list", 1, pageSize, false);
});

function pagination(totalAccount, url, page, pageSize, checkLoadPage) {
    var totalPage = Math.ceil(totalAccount / pageSize);

    if (checkLoadPage) {
        // remove paging data
        $(CONST.PAGING_ID).empty();
        $(CONST.PAGING_ID).removeData("twbs-pagination");
        $(CONST.PAGING_ID).unbind("page");
    }

    $(CONST.PAGING_ID).twbsPagination({
        initiateStartPageClick: false,
        totalPages: totalPage,
        visiblePages: 5,
        first: "First",
        next: "Next",
        last: "Last",
        prev: "Previous",
        onPageClick: function (event, page) {
            loadData(url, page, pageSize, false);
        }
    });
}

function buttonClickEvent(kindOfButton, idHandle, event) {
    event.stopPropagation();
    if (kindOfButton === "buttonEdit") {
        showModal(idHandle);
    } else {
        $(CONST.TOGGLE_AREA_ID).onclick = toggleRowTable(idHandle);
    }
}

function toggleRowTable(id) {
    $("#" + id).toggle();
}

function loadData(url, page, pageSize, checkLoadData) {
    $.ajax({
        url: url,
        data: {page: page, size: pageSize},
        success: function (response) {
            let html = ``;
            response.listData.forEach(account => {
                html += (`
                <tr id="toggleArea" onclick="buttonClickEvent(this.id,'${account.id}', event);">
                    <td>
                        <div style="width: 40%;" class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="cb-mail-${account.email}">
                            <label class="custom-control-label" for="cb-mail-${account.email}">${account.email}</label>
                        </div>
                    </td>
                    <td style="width: 15%;">${account.fullname}</td>
                    <td style="width: 20%;">${account.phone}</td>
                `);
                if (account.status === 1) {
                    html += `<td style="width: 15%;"> Activated</td>`
                }
                if (account.status === 0) {
                    html += `<td style="width: 15%;">Disabled</td>`
                }
                html += (`
                    <td style="width: 10%;">
                        <img id="buttonEdit" onclick="buttonClickEvent(this.id,'${account.id}', event);" class="img-edit" width="20px" height="20px" src="../img/icon-edit.JPG"
                                   title="update account"></i></td>
                </tr>
                    <tr id="${account.id}" style="display: none;">
                        <td colspan="6">
                            <div class="row">
                                <div class="col-1"></div>
                                <label class="col-2">Email:</label>
                                <label class="col-2">${account.email}</label>
                            </div>
                            <div class="row">
                                <div class="col-1"></div>
                                <label class="col-2">Full Name:</label>
                                <label class="col-8">${account.fullname}</label>
                            </div>
                            <div class="row">
                                <div class="col-1"></div>
                                <label class="col-2">Phone:</label>
                                <label class="col-8">${account.phone}</label>
                            </div>
                `);

                if (account.status === 1) {
                    html += `
                            <div class="row">
                                <div class="col-1"></div>
                                <label class="col-2">Status:</label>
                                <label class="col-8">Activated</label>
                            </div>`
                }

                if (account.status === 0) {
                    html += `
                            <div class="row">
                                <div class="col-1"></div>
                                <label class="col-2">Status:</label>
                                <label class="col-8">Disable</label>
                            </div>`
                }

                html += (`
                    <div class="row">
                        <div class="col-1"></div>
                        <label class="col-2">Salt:</label>
                        <label class="col-8">${account.salt}</label>
                    </div>
                `);
                html += (`
                    <div class="row">
                        <div class="col-1"></div>
                            <label class="col-2">Updated:</label>
                            <label class="col-8">${account.updated}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Updated by:</label>
                            <label class="col-8">${account.updatedBy}</label>
                        </div>
                    </td>                    
                </tr>
                `);
            });

            $(CONST.LIST_ACCOUNT_ID).html(html);
            $(CONST.TOTAL_RECORD_ID).html(response.totalRow);
            pagination(response.totalRow, url, page, pageSize, checkLoadData);
        }
    });
}

function showModal(id = null) {
    $(CONST.PASSWORD_CONTAINER_ID).css("display", "block");
    $(CONST.EMAIL_SPACE_MODAL_ID).css("display", "block");
    resetAccountModal();
    if (id != null) {
        $(CONST.MODAL_TITLE_ID).html("Update account");
        $(CONST.BTN_SUBMIT_FORM_ID).html("Update");
        $(CONST.CREATE_STATUS_ID).css("display", "block");
        $(CONST.PASSWORD_CONTAINER_ID).css("display", "none");
        $(CONST.EMAIL_SPACE_MODAL_ID).css("display", "none");
        $.ajax({
            url: "./findById",
            method: "get",
            data: {id: id},
            dataType: "json",
            success: function (response) {
                if (response.statusCode === "200") {
                    bindAccountDataToModal(response);
                }
            },
            error: function (error) {
                ajaxErrorHandler(error);
            },
            async: false
        });
    } else {
        $(CONST.MODAL_ACCOUNT_ID).css("display", "block")
        $(CONST.MODAL_TITLE_ID).html("Create account");
        $(CONST.BTN_SUBMIT_FORM_ID).html("Save");
        $(CONST.CREATE_STATUS_ID).css("display", "none");
        $(CONST.UPDATE_STATUS_ID).css("display", "none");
    }
    $(CONST.MODAL_ACCOUNT_ID).modal({show: true});
}

function submitFormAccount() {
    let id = $(CONST.F_ID).val();
    if (id === "") {
        createAccount();
    } else {
        updateAccount();
    }
}

function createAccount() {
    if ($(CONST.PASSWORD_ID).val().length < 8 || $(CONST.PASSWORD_ID).val().length > 10) {
        return alertify.message("Password size must be between 8 and 10");
    }
    $.ajax({
        url: "./add",
        method: "post",
        contentType: "application/json; charset=utf-8",
        data: bindModalDataToAccountJson(),
        success: function (response) {
            ajaxCrudSuccessHandler(response, CONST.MODAL_ACCOUNT_ID, function () {
                loadData("./list", 1, pageSize, true)
            }, resetAccountModal());
        },
        error: function (error) {
            ajaxErrorHandler(error);
        }
    });
}

function resetAccountModal() {
    $(CONST.F_ID).val("");
    $(CONST.FORM_ACCOUNT_ID)[0].reset();
    $(CONST.FORM_ACCOUNT_ID).removeClass('was-validated');
    $(CONST.MESSRES).html('');
    $(CONST.EMAIL_ID).css("border-color", "#ced4da");
}

function updateAccount() {
    $.ajax({
        url: "./update",
        method: "post",
        contentType: "application/json; charset=utf-8",
        data: bindModalDataToAccountJson(),
        success: function (response) {
            ajaxCrudSuccessHandler(response, CONST.MODAL_ACCOUNT_ID, function () {
                loadData("./list", 1, pageSize, false)
            }, resetAccountModal());

        },
        error: function (error) {
            ajaxErrorHandler(error);
        }
    });
}

function showImportDialog() {
    importBtn.click();
}

function checkExistEmail() {
    let keyword = $(CONST.EMAIL_ID).val();
    let id = $(CONST.F_ID).val();
    if (id === "") {
        $.ajax({
            url: "./checkExistEmail",
            method: "get",
            async: false,
            contentType: "application/json; charset=utf-8",
            data: {email: keyword},
            success: function (response) {
                if (response === true) {
                    let html = `<span style="color: red; font-size: small">Email is existed!</span>`
                    $(CONST.MESSRES).html(html);
                    $(CONST.EMAIL_ID).css("border-color", "#dc3545");
                    //$(CONST.NAME_ID).css("background-image", "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23dc3545' viewBox='-2 -2 7 7'%3e%3cpath stroke='%23dc3545' d='M0 0l3 3m0-3L0 3'/%3e%3ccircle r='.5'/%3e%3ccircle cx='3' r='.5'/%3e%3ccircle cy='3' r='.5'/%3e%3ccircle cx='3' cy='3' r='.5'/%3e%3c/svg%3E\")");
                    existEmail = true;
                } else {
                    $(CONST.MESSRES).html('');
                    $(CONST.EMAIL_ID).css("border-color", "");
                    existEmail = false;
                }
            },
        });
    } else {
        existEmail = false;
    }
}

$(CONST.BTN_SUBMIT_FORM_ID).click(function (event) {
    // Fetch form to apply custom Bootstrap validation
    let form = $(CONST.FORM_ACCOUNT_ID);
    if (form[0].checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }

    form.addClass('was-validated');
    checkExistEmail();
    if (form[0].checkValidity() === true && !existEmail) {
        submitFormAccount();
    }
});

function bindAccountDataToModal(response) {
    $(CONST.F_ID).val(response.data.id);
    $(CONST.F_ACCOUNT_ID).val(response.data.accountId);
    $(CONST.EMAIL_ID).val(response.data.email);
    $(CONST.PASSWORD_ID).val(response.data.password);
    $(CONST.PHONE_ID).val(response.data.phone);
    $(CONST.FULL_NAME_ID).val(response.data.fullname);
    $(CONST.SALT_ID).val(response.data.salt);
    $(CONST.F_UPDATE_BY_ID).val(response.data.updatedBy);
    $(CONST.CREATE_BY_ID).val(response.data.createdBy);
    if (response.data.status === 1) {
        $(CONST.STATUS_ID).val(1);
    } else {
        $(CONST.STATUS_ID).val(0);
    }
    if (response.data.updated !== null) {
        $(CONST.UPDATE_STATUS_ID).css("display", "block");
        $(CONST.TIME_UPDATE_ID).val(response.data.updated);
    }
}

function bindModalDataToAccountJson() {
    return JSON.stringify({
        id: $(CONST.F_ID).val(),
        accountId: $(CONST.F_ACCOUNT_ID).val(),
        email: $(CONST.EMAIL_ID).val(),
        phone: $(CONST.PHONE_ID).val(),
        fullname: $(CONST.FULL_NAME_ID).val(),
        status: $(CONST.STATUS_ID).val(),
        password: $(CONST.PASSWORD_ID).val().toString(),
    })
}
