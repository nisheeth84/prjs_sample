var pageSize = 5;
var CONST = {
    PAGING_ID: '#pagination',
    BTN_EXPORT_ID: "#btnExport",
    BTN_BACKUP_ID: "#btnBackup",
    BTN_RELOAD_ID: "#btnReload",
    BTN_IMPORT_ID: "#real-file",
    BTN_SEARCH_ID: "#search",
    LIST_APPLICATION_ID: "#listApplication",
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
    F_UPDATE_BY_ID: '#f-updatedBy',
    F_APPLICATION_ID: '#f-applicationId',
    FORM_APPLICATION_ID: "#formApplication",
    CREATE_BY_ID: "#createdBy",
    STATUS_ID: "#status",
    UPDATED_BY_ID: "#updatedBy",
    UPDATED_ID: "#updated",
    TOGGLE_AREA_ID: '#toggleArea',
    TIME_UPDATE_ID: "#timeUpdated"
};
// const importBtn = document.querySelector(CONST.BTN_IMPORT_ID);
var importBtn;

$(document).ready(function () {
    $(CONST.BTN_EXPORT_ID).css("display", "none");
    $(CONST.BTN_BACKUP_ID).css("display", "none");
    $(CONST.BTN_RELOAD_ID).css("display", "none");
    importBtn = $(CONST.BTN_IMPORT_ID);
    importBtn.on('change', function () {
        importDataFromFile();
    });
    loadData("./list", 1, pageSize, false)
});

function pagination(totalAccount, url, page, pageSize, checkPage) {
    let totalPage = Math.ceil(totalAccount / pageSize);

    if (checkPage) {
        // remove paging data
        $(CONST.PAGING_ID).empty();
        $(CONST.PAGING_ID).removeData("twbs-pagination");
        $(CONST.PAGING_ID).unbind("page");
    }

    $(CONST.PAGING_ID).twbsPagination({
        initiateStartPageClick: false,
        totalPages: totalPage,
        visiblePages: 5,
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

function loadData(url, page, pageSize, checkLoad) {
    $.ajax({
        url: url,
        data: {page: page, pageSize: pageSize},
        success: function (response) {
            let html = ``;
            if (response.statusCode === "200") {
                response.listData.forEach(app => {
                    html += (`
                <tr id="toggleArea" onclick="buttonClickEvent(this.id,'${app.id}', event);">
                    <td>
                        <div style="width: 35%;" class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="cb-mail-${app.appId}">
                            <label class="custom-control-label" for="cb-mail-${app.id}">${app.appId}</label>
                        </div>
                    </td>
                    <td style="width: 35%;">${app.contact}</td>
                `);
                    if (app.status === 1) {
                        html += `<td style="width: 15%;"> Activated</td>`
                    }
                    if (app.status === 0) {
                        html += `<td style="width: 15%;">Disabled</td>`
                    }
                    html += (`
                    <td style="width: 5%;">
                        </tdstyle><img id="buttonEdit"  onclick="buttonClickEvent(this.id,'${app.id}', event);" class="img-edit" width="20px" height="20px" src="../img/icon-edit.JPG"
                                   title="update application"></i></td>
                </tr>
                <tr id="${app.id}" style="display: none;">
                    <td colspan="6">
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">App Id:</label>
                            <label class="col-2">${app.appId}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Contact:</label>
                            <label class="col-8">${app.contact}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Created by:</label>
                            <label class="col-8">${app.createdBy}</label>
                        </div>
                        `);
                    if (app.status === 1) {
                        html += `
                            <div class="row">
                                <div class="col-1"></div>
                                <label class="col-2">Status:</label>
                                <label class="col-8">Activated</label>
                            </div>
                                    `
                    }
                    if (app.status === 0) {
                        html += `
                            <div class="row">
                                <div class="col-1"></div>
                                <label class="col-2">Status:</label>
                                <label class="col-8">Disable</label>
                            </div>
                                        `
                    }
                    html += (`<div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Token:</label>
                            <label class="col-8">${app.token}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Update Date:</label>
                            <label class="col-8">${app.updated}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Updated By:</label>
                            <label class="col-8">${app.updatedBy}</label>
                        </div>
                `);
                });
            }
            $(CONST.LIST_APPLICATION_ID).html(html);
            $(CONST.TOTAL_APPLICATION_ID).html(response.totalRow);

            pagination(response.totalRow, url, page, pageSize, checkLoad);
        }
    });
}

function search() {
    let isSearchMode = true;
    let keyword = $(CONST.BTN_SEARCH_ID).val();
    let url = "./search?keyword=" + keyword;
    if (keyword.length === 0) {
        url = "./list";
    }
    loadData(url, 1, pageSize, isSearchMode);
}

function showImportDialog() {
    importBtn.click();
}

function handleEventClick(event) {
    var reader = new FileReader();
    reader.onLoad = onReaderLoad;
    reader.readAsText(event.target.files[0]);
    importBtn.valueOf();
    // alertify.error("input file invalid \n import .json file");
}

function onReaderLoad(event) {
    console.log(event.target.result);
    var obj = JSON.parse(event.target.result);
    alert_data(obj[0].id, obj[0].name);
}

function alert_data(id, name) {
    alert('Id : ' + id + ',Name: ' + name);
}

function showModal(id = null) {
    if (id != null) {
        $(CONST.MODAL_TITLE_ID).html("Update Application");
        $(CONST.BTN_SUBMIT_FORM_ID).html("Update");
        $(CONST.CREATE_STATUS_ID).css("display", "block");
        $(CONST.PASSWORD_CONTAINER_ID).css("display", "none");
        $.ajax({
            url: "./findById",
            method: "get",
            data: {id: id},
            dataType: "json",
            success: function (response) {
                if (response.statusCode === "200") {
                    bindApplicationDataToModal(response);
                }
            },
            error: function (error) {
                ajaxErrorHandler(error);
            },
            async: false
        });
    } else {
        $(CONST.MODAL_APPLICATION_ID).css("display", "block");
        $(CONST.MODAL_TITLE_ID).html("Create Application");
        $(CONST.BTN_SUBMIT_FORM_ID).html("Save");
        $(CONST.UPDATE_STATUS_ID).css("display", "none");
        $(CONST.CREATE_STATUS_ID).css("display", "none");
    }

    $(CONST.MODAL_APPLICATION_ID).modal({show: true});
}

function resetApplicationModal() {
    $(CONST.F_ID).val("");
    $(CONST.FORM_APPLICATION_ID).removeClass('was-validated');
    $(CONST.FORM_APPLICATION_ID)[0].reset();
    $(CONST.UPDATE_STATUS_ID).css("display", "none");
}

function submitForm() {
    let id = $(CONST.F_ID).val();
    if (id === "") {
        createApplication();
    } else {
        updateApplication();
    }
}

function createApplication() {
    $.ajax({
        url: "./add",
        method: "post",
        contentType: "application/json; charset=utf-8",
        data: bindModalDataToApplicationJson(),
        success: function (response) {
            if (response.statusCode === "200") {
                ajaxCrudSuccessHandler(response, CONST.MODAL_APPLICATION_ID, function () {
                    loadData("./list", 1, pageSize, true)
                }, resetApplicationModal());

            }
        },
        error: function (error) {
            ajaxErrorHandler(error);
        }
    });
}

function updateApplication() {
    $.ajax({
        url: "./update",
        method: "post",
        contentType: "application/json; charset=utf-8",
        data: bindModalDataToApplicationJson(),
        success: function (response) {
            if (response.statusCode === "200") {
                ajaxCrudSuccessHandler(response, CONST.MODAL_APPLICATION_ID, function () {
                    loadData("./list", 1, pageSize, false)
                }, resetApplicationModal());
            }
        },
        error: function (error) {
            ajaxErrorHandler(error);
        }
    });
}

function bindModalDataToApplicationJson() {
    return JSON.stringify({
        id: $(CONST.F_ID).val(),
        applicationId: $(CONST.F_APPLICATION_ID).val(),
        token: $(CONST.TOKEN_ID).val(),
        contact: $(CONST.CONTACT_ID).val(),
        appId: $(CONST.APP_ID).val(),
        status: $(CONST.STATUS_ID).val().toString(),
    });
}

function bindApplicationDataToModal(response) {
    $(CONST.F_ID).val(response.data.id);
    $(CONST.F_APPLICATION_ID).val(response.data.applicationId);
    $(CONST.TOKEN_ID).val(response.data.token);
    $(CONST.CONTACT_ID).val(response.data.contact);
    $(CONST.APP_ID).val(response.data.appId);
    $(CONST.CREATE_BY_ID).val(response.data.createdBy);
    if (response.data.status === 1) {
        $(CONST.STATUS_ID).val(1);
    } else {
        $(CONST.STATUS_ID).val(0);
    }
    if (response.data.updatedTime !== null) {
        $(CONST.F_UPDATE_BY_ID).val(response.data.updatedBy);
        $(CONST.TIME_UPDATE_ID).val(response.data.updated);
        $(CONST.UPDATE_STATUS_ID).css("display", "block");
    }
}
