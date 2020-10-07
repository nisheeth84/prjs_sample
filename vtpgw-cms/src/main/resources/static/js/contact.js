const pageSize = 5;
let isSearchMode = false;
let isAdd = false;
let existEmail = false;
const CONST = {
    PAGING_ID: '#pagination',
    BTN_EXPORT_ID: "#btnExport",
    BTN_BACKUP_ID: "#btnBackup",
    BTN_RELOAD_ID: "#btnReload",
    BTN_IMPORT_ID: "#real-file",
    BTN_SEARCH_ID: "#search",
    TOTAL_APPLICATION_ID: "#totalApplication",
    MODAL_TITLE_ID: "#modalTitle",
    BTN_SUBMIT_FORM_ID: "#btnSubmitForm",
    CREATE_STATUS_ID: "#createdStatus",
    PASSWORD_CONTAINER_ID: "#passwordContainer",
    MODAL_APPLICATION_ID: "#modalApplication",
    UPDATE_STATUS_ID: "#updateStatus",
    CONTACT_ID: "#contact",
    TOKEN_ID: "#token",
    APP_ID: "#appId",
    F_ID: "#f-id",
    FORM_APPLICATION_ID: "#formApplication",
    CREATE_BY_ID: "#createdBy",
    STATUS_ID: "#status",
    UPDATED_BY_ID: "#updatedBy",
    TIME_UPDATE_ID: "#timeUpdated",
    LIST_CONTACTS_ID: "#listContacts",
    TOTAL_RECORD_ID: "#totalRecord",
    MODAL_ACCOUNT_ID: "#modalAccount",
    EMAIL_ID: "#email",
    PHONE_ID: "#phone",
    FULL_NAME_ID: "#fullname",
    SALT_ID: "#salt",
    PASSWORD_ID: "#password",
    FORM_ACCOUNT_ID: "#formAccount",
    FORM_CONTACT_ID: "#formContact",
    ADDRESS_ID: "#address",
    MODAL_CONTACT_ID: "#modalContact",
    MESSRES: "#messRes",
    TOGGLE_AREA_ID: '#toggleArea',
    EMAIL_SPACE_MODAL_ID: '#emailModalSpace',
};
var importBtn;

function search() {
    let keyword = $(CONST.BTN_SEARCH_ID).val();
    let url = "/contact/search?keyword=" + keyword;
    if (keyword.length === 0) {
        isSearchMode = false;
        url = "/contact/list";
    } else {
        isSearchMode = true;
    }
    loadData(url, 1, pageSize);
}

$(document).ready(function () {
    $(CONST.BTN_EXPORT_ID).css("display", "none");
    $(CONST.BTN_BACKUP_ID).css("display", "none");
    $(CONST.BTN_RELOAD_ID).css("display", "none");
    importBtn = $(CONST.BTN_IMPORT_ID);
    importBtn.on('change', function () {
        importDataFromFile();
    });
    // loadData("/contact/list", 1, pageSize);
});

function pagination(totalAccount, url, page, pageSize) {
    var totalPage = Math.ceil(totalAccount / pageSize);

    if (isSearchMode || isAdd) {
        isSearchMode = false;
        isAdd = false;
        // remove paging data
        $(CONST.PAGING_ID).empty();
        $(CONST.PAGING_ID).removeData("twbs-pagination");
        $(CONST.PAGING_ID).unbind("page");
    }

    $(CONST.PAGING_ID).twbsPagination({
        totalPages: totalPage,
        visiblePages: 5,
        first: "First",
        next: "Next",
        last: "Last",
        prev: "Previous",
        onPageClick: function (event, page) {
            loadData(url, page, pageSize);
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

function loadData(url, page, pageSize) {
    $.ajax({
        url: url,
        data: {page: page, size: pageSize},
        success: function (response) {
            let html = ``;
            response.listData.forEach(contact => {
                html += (`
                <tr id="toggleArea" onclick="buttonClickEvent(this.id,'${contact.id}', event);">
                    <td>
                        <div style="width: 40%;" class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="cb-mail-${contact.email}">
                            <label class="custom-control-label" for="cb-mail-${contact.email}">${contact.email}</label>
                        </div>
                    </td>
                    <td style="width: 15%;">${contact.fullname}</td>
                    <td style="width: 20%;">${contact.phone}</td>
                    <td style="width: 20%;">${contact.address}</td>
                `);
                if (contact.status === 1) {
                    html += `<td style="width: 15%;"> Activated</td>`
                }
                if (contact.status === 0) {
                    html += `<td style="width: 15%;">Disabled</td>`
                }
                html += (`
                    <td style="width: 10%;">
                        <img id="buttonEdit" onclick="buttonClickEvent(this.id,'${contact.id}', event);" class="img-edit" width="20px" height="20px" src="../img/icon-edit.JPG"
                                   title="update contact"></i></td>
                </tr>
                `);

                html += (`
                    <tr id="${contact.id}" style="display: none;">
                    <td colspan="6">
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Email:</label>
                            <label class="col-2">${contact.email}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Full Name:</label>
                            <label class="col-2">${contact.fullname}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Phone:</label>
                            <label class="col-2">${contact.phone}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Address:</label>
                            <label class="col-2">${contact.address}</label>
                        </div>
                `);

                if (contact.status === 1) {
                    html += `
                            <div class="row">
                                <div class="col-1"></div>
                                <label class="col-2">Status:</label>
                                <label class="col-8">Activated</label>
                            </div>
                                    `
                }

                if (contact.status === 0) {
                    html += `
                            <div class="row">
                                <div class="col-1"></div>
                                <label class="col-2">Status:</label>
                                <label class="col-8">Disable</label>
                            </div>
                                        `
                }

                html += (`
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Updated:</label>
                            <label class="col-8">${contact.updated}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Updated by:</label>
                            <label class="col-8">${contact.updatedBy}</label>
                        </div>
                    </td>                    
                </tr>
                `);
            });

            $(CONST.LIST_CONTACTS_ID).html(html);
            $(CONST.TOTAL_RECORD_ID).html(response.totalRow);

            pagination(response.totalRow, url, page, pageSize);
        }
    });
}

function showModal(id = null) {
    $(CONST.EMAIL_SPACE_MODAL_ID).css("display", "block");
    resetContactModal();
    if (id != null) {
        $(CONST.MODAL_TITLE_ID).html("Update Contact");
        $(CONST.BTN_SUBMIT_FORM_ID).html("Update");
        $(CONST.CREATE_STATUS_ID).css("display", "block");
        $(CONST.EMAIL_SPACE_MODAL_ID).css("display", "none");
        $.ajax({
            url: "/contact/findById",
            method: "get",
            data: {id: id},
            dataType: "json",
            success: function (response) {
                if (response.statusCode === "200") {
                    $(CONST.F_ID).val(id);
                    $(CONST.EMAIL_ID).val(response.data.email);
                    $(CONST.PHONE_ID).val(response.data.phone);
                    $(CONST.FULL_NAME_ID).val(response.data.fullname);
                    $(CONST.ADDRESS_ID).val(response.data.address);
                    $(CONST.CREATE_BY_ID).val(response.data.createdBy);
                    $(CONST.UPDATED_BY_ID).val(response.data.updatedBy);
                    if (response.data.status === 1) {
                        $(CONST.STATUS_ID).val(1);
                    } else {
                        $(CONST.STATUS_ID).val(0);
                    }
                    if (response.data.updated !== null) {
                        $(CONST.UPDATE_STATUS_ID).css("display", "block");
                        $(CONST.TIME_UPDATE_ID).html(response.data.updated);
                    }
                }
            },
            error: function (error) {
                alertify.error('error!');
            },
            async: false
        });
    } else {
        $(CONST.MODAL_TITLE_ID).html("Create Contact");
        $(CONST.BTN_SUBMIT_FORM_ID).html("Save");
        $(CONST.UPDATE_STATUS_ID).css("display", "none");
        $(CONST.CREATE_STATUS_ID).css("display", "none");
    }

    $(CONST.MODAL_CONTACT_ID).modal({show: true});
}

function submitFormContact() {
    let id = $(CONST.F_ID).val();
    if (id === "") {
        createContact();
    } else {
        updateContact();
    }
}

function createContact() {
    $.ajax({
        url: "/contact/add",
        method: "post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            email: $(CONST.EMAIL_ID).val().toString().trim(),
            phone: $(CONST.PHONE_ID).val().toString().trim(),
            fullname: $(CONST.FULL_NAME_ID).val().toString().trim(),
            status: $(CONST.STATUS_ID).val().toString(),
            address: $(CONST.ADDRESS_ID).val().toString().trim(),
            createdBy: "current user",  //todo
        }),
        success: function (response) {
            if (response.statusCode === "200") {
                $(CONST.MODAL_CONTACT_ID).modal("hide");
                isAdd = true;
                loadData("/contact/list", 1, pageSize);
                alertify.set('notifier', 'position', 'top-right');
                alertify.success('successful!');
                resetContactModal();
            }

        },
        error: function (error) {
            if (error.responseJSON.statusCode === 400) {
                alertify.message("Fill out required field");
            } else {
                alertify.error();
            }
        }
    });
}

function resetContactModal() {
    $(CONST.F_ID).val("");
    $(CONST.FORM_CONTACT_ID).removeClass('was-validated');
    $(CONST.FORM_CONTACT_ID)[0].reset();
    $(CONST.MESSRES).html('');
    $(CONST.UPDATE_STATUS_ID).css("display", "none");
}

function updateContact() {
    $.ajax({
        url: "/contact/update",
        method: "post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            id: $(CONST.F_ID).val(),
            email: $(CONST.EMAIL_ID).val().trim(),
            phone: $(CONST.PHONE_ID).val().trim(),
            fullname: $(CONST.FULL_NAME_ID).val().trim(),
            status: $(CONST.STATUS_ID).val(),
            address: $(CONST.ADDRESS_ID).val().trim(),
            updatedBy: "current user",  //todo
        }),
        success: function (response) {
            if (response.statusCode === "200") {
                $(CONST.MODAL_CONTACT_ID).modal("hide");
                loadData("/contact/list", 1, pageSize);
                alertify.set('notifier', 'position', 'top-right');
                alertify.success('successful!');
                resetContactModal();
            }
        },
        error: function (error) {
            if (error.responseJSON.statusCode === 400) {
                alertify.message("Fill out required field");
            } else {
                alertify.error();
            }
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
            url: "/contact/checkExistEmail",
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
    let form = $(CONST.FORM_CONTACT_ID);

    if (form[0].checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }

    form.addClass('was-validated');
    checkExistEmail();
    if (form[0].checkValidity() === true && !existEmail) {
        console.log("Submitting");
        submitFormContact();
    }
});
