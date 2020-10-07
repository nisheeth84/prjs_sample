const pageSize = 5;
let CONST = {
    PAGING_ID: '#pagination',
    SELECT_APPLICATION_ID: '#selectApplication',
    FORM_PERMISSION_ID: '#formPermission',
    LIST_APP_PERMISSION: '#listAppPermission',
    F_UPDATE_BY_ID: '#f-updatedBy',
    SELECT_SERVICE_ID: '#selectService',
    ACTIVATED_DATE_ID: '#activatedDate',
    DEBUG_ID: '#debug',
    SANDBOX_ID: '#sandBox',
    NO_CONTENT_ID: '#noContent',
    CAPACITY_ID: '#capacity',
    BTN_EXPORT_ID: "#btnExport",
    BTN_BACKUP_ID: "#btnBackup",
    BTN_RELOAD_ID: "#btnReload",
    BTN_IMPORT_ID: "#real-file",
    BTN_SEARCH_ID: "#search",
    MODAL_TITLE_ID: "#modalTitle",
    BTN_SUBMIT_FORM_ID: "#btnSubmitForm",
    BTN_REMOVE_ID: '#btnRemove',
    CREATE_STATUS_ID: "#createdStatus",
    UPDATE_STATUS_ID: "#updateStatus",
    TOKEN_ID: "#token",
    APP_ID: "#appId",
    F_ID: "#f-id",
    F_PERMISSION_ID: "f-permissionId",
    MODAL_PERMISSION_ID: "#modalPermission",
    STATUS_ID: "#status",
    TIME_UPDATE_ID: "#timeUpdated",
    TOTAL_RECORD_ID: "#totalRecords",
    METHODS_ID: "#methods",
    PERIOD_ID: "#period",
    IPS_ID: "#ips",
    ERR_IPS_ID: "#errIps"
};

const ips = [""];

$(document).ready(function () {
    $(CONST.BTN_EXPORT_ID).css("display", "none");
    $(CONST.BTN_BACKUP_ID).css("display", "none");
    $(CONST.BTN_RELOAD_ID).css("display", "none");
    importBtn = $(CONST.BTN_IMPORT_ID);
    importBtn.on('change', function () {
        importDataFromFile();
    });
    loadData("./list", 1, pageSize, false);
    getApplications();
    getServices();
});

function toggleRowTable(id) {
    $("#" + id).toggle();
}

function showModal(id) {
    resetModal();
    this.renderIps();
    if (id != null) {
        $(CONST.MODAL_TITLE_ID).html("Update permission");
        $(CONST.BTN_SUBMIT_FORM_ID).html("Update");
        $.ajax({
            url: "./findById",
            method: "get",
            data: {id: id},
            dataType: "json",
            success: function (response) {
                if (response.statusCode === "200") {
                    bindPermissionDataToModal(response);
                }
            },
            error: function (error) {
                ajaxErrorHandler(error);
            },
            async: false
        });
    } else {
        $(CONST.MODAL_PERMISSION_ID).css("display", "block");
        $(CONST.MODAL_TITLE_ID).html("Create permission");
        $(CONST.BTN_SUBMIT_FORM_ID).html("Save");
        $(CONST.UPDATE_STATUS_ID).css("display", "none");
    }
    $(CONST.MODAL_PERMISSION_ID).modal({show: true});
}

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

function loadData(url, page, pageSize, checkLoad) {
    $.ajax({
        url: url,
        data: {page: page, pageSize: pageSize},
        success: function (response) {
            let html = ``;
            if (response.statusCode === "200") {
                response.listData.forEach(permission => {
                    html += (`
                    <tr id="toggleArea" onclick="buttonClickEvent(this.id,'detailAppPermission_${permission.id}', event);">
                    <td data-toggle="collapse" data-target="#detailAppPermission">
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="${permission.id}">
                            <label style="font-weight: normal" class="custom-control-label"
                                   for="${permission.id}"></label>
                        </div>
                    </td>
                    <td data-toggle="collapse" data-target="#detailAppPermission" style="width: 30%;">${permission.appId}</td>
                    <td data-toggle="collapse" data-target="#detailAppPermission" style="width: 30%;">${permission.serviceId}</td>
                    <td data-toggle="collapse" data-target="#detailAppPermission" style="width: 20%;">${permission.capacity}</td>
                    <td data-toggle="collapse" data-target="#detailAppPermission" style="width: 15%;">${permission.period}</td>
                    <td style="width: 5%;">
                        <img id="buttonEdit" onclick="buttonClickEvent(this.id,'${permission.id}', event)" class="img-edit" width="20px" height="20px"
                             src="../img/icon-edit.JPG"
                             title="update permission">
                    </td>
                </tr>
                <tr id="detailAppPermission_${permission.id}" style="display: none;">
                    <td colspan="5">
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Activated:</label>
                            <label class="col-2">${permission.activated}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Ip Address:</label>
                            <label class="col-2">${permission.ips}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Method:</label>
                            <label class="col-2">${permission.methods}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Update Date:</label>
                            <label class="col-2">${permission.updated}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Updated By:</label>
                            <label class="col-2">${permission.updatedBy}</label>
                        </div>
                    </td>
                </tr>`);
                });
            }
            $(CONST.LIST_APP_PERMISSION).html(html);
            $(CONST.TOTAL_RECORD_ID).html(response.totalRow);
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

function getApplications() {
    $.ajax({
        url: "../application/list",
        data: {page: 1, pageSize: 10},
        success: function (response) {
            let html = '';
            if (response.statusCode === "200") {
                response.listData.forEach(app => {
                    html += (`<option value="${app.appId}">${app.appId}</option>`);
                });
                $(CONST.SELECT_APPLICATION_ID).html(html);
            }
        }
    });
}

function getServices() {
    $.ajax({
        url: "../service/list",
        data: {page: 1, pageSize: 10},
        success: function (response) {
            let html = '';
            if (response.statusCode === "200") {
                response.listData.forEach(service => {
                    html += (`<option value="${service.name}">${service.name}</option>`);
                });
                $(CONST.SELECT_SERVICE_ID).html(html);
            }
        }
    });
}

function resetModal() {
    $(CONST.F_ID).val("");
    $(CONST.FORM_PERMISSION_ID)[0].reset();
    $(CONST.UPDATE_STATUS_ID).css("display", "none");
    ips.splice(0, ips.length);
    ips.push([""]);
}

function submitForm() {
    updateValueIps();
    let id = $(CONST.F_ID).val();
    if (id === "") {
        createPermission();
    } else {
        updatePermission();
    }

}

function createPermission() {
    $.ajax({
        url: "./add",
        method: "post",
        contentType: "application/json; charset=utf-8",
        data: bindModalDataToPermissionJson(),
        success: function (response) {
            ajaxCrudSuccessHandler(response, CONST.MODAL_PERMISSION_ID, function () {
                loadData("./list", 1, pageSize, true)
            }, resetModal());
        },
        error: function (error) {
            ajaxErrorHandler(error);
        }
    });
}

function updatePermission() {
    $.ajax({
        url: "./update",
        method: "post",
        contentType: "application/json; charset=utf-8",
        data: bindModalDataToPermissionJson(),
        success: function (response) {
            ajaxCrudSuccessHandler(response, CONST.MODAL_PERMISSION_ID, function () {
                loadData("./list", 1, pageSize, false)
            }, resetModal());
        },
        error: function (error) {
            ajaxErrorHandler(error);
        }
    });
}

function addTableRow() {
    updateValueIps();
    ips.push("");
    renderIps();
}

function deleteValueIp(index) {
    updateValueIps();
    ips.splice(index, 1);
    renderIps();
}

function renderIps() {
    let html = "";
    ips.forEach((item, index) => {
        html += `<div class="item-ip" style="height: 40px">
                    <div class="col-lg-8 p-0 float-left">
                        <input type="text" class="form-control" style="width: 95%; border: none; border-bottom: solid 1px #ccc"
                               name="ip" value="${item}" 
                               pattern="^([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$"
                               placeholder="Enter ip" required/>
                               <div class="invalid-feedback">No, you missed this one or wrong format</div>                
                    </div>
                    <div class="col-lg-4 p-0 float-right mt-1">
                        <div class="float-right mr-2">
                            <button id="btnRemove" type="button" class="border-0" style="background-color: white" title="remove" onclick="deleteValueIp(${index})"><i
                                    class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                  
                </div>`;
    });
    html += (`
              <div id="errIps"></div>
              <div class="seperate pt-2"></div>
              <button onclick="addTableRow()" class="border-0 float-right" style="background-color: white">
                   <img width="30" height="30" src="../img/icon_add.png"/>
              </button>`);
    $(CONST.IPS_ID).html(html);
    checkButtonRemove(ips.length, CONST.BTN_REMOVE_ID)
}

function setValueIps(values) {
    ips.splice(0, ips.length);
    values.forEach(value =>
        ips.push(value)
    );
}

function updateValueIps() {
    var urls = $('input[name ="ip"]');
    for (i = 0; i < ips.length; i++) {
        ips[i] = urls[i].value;
    }
}

function showImportDialog() {
    importBtn.click();
}

$(CONST.BTN_SUBMIT_FORM_ID).click(function (event) {
    // Fetch form to apply custom Bootstrap validation
    let form = $(CONST.FORM_PERMISSION_ID);
    let checkIp = true;
    if (ips.length > 1) {
        checkIp = validateDuplicate('input[name ="ip"]');
    }
    if (form[0].checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.addClass('was-validated');
    if (form[0].checkValidity() === true) {
        console.log("Submitting");
        if (checkIp) {
            submitForm();
        } else {
            $(CONST.ERR_IPS_ID).html('<p style="color: red; font-size: small">ip duplicate</p>')
            alertify.error('error!');
        }
    }
});

function bindModalDataToPermissionJson() {
    return JSON.stringify({
        id: $(CONST.F_ID).val(),
        permissionId: $(CONST.F_PERMISSION_ID).val(),
        capacity: $(CONST.CAPACITY_ID).val(),
        period: $(CONST.PERIOD_ID).val(),
        noContent: $(CONST.NO_CONTENT_ID).prop("checked") === true ? 1 : 0,
        sandBox: $(CONST.SANDBOX_ID).prop("checked") === true ? 1 : 0,
        debug: $(CONST.DEBUG_ID).prop("checked") === true ? 1 : 0,
        activated: $(CONST.ACTIVATED_DATE_ID).val(),
        serviceId: $(CONST.SELECT_SERVICE_ID).val(),
        appId: $(CONST.SELECT_APPLICATION_ID).val(),
        methods: $(CONST.METHODS_ID).val(),
        ipList: ips
    });
}

function bindPermissionDataToModal(response) {
    $(CONST.F_ID).val(response.data.id);
    $(CONST.F_PERMISSION_ID).val(response.data.permissionId)
    $(CONST.METHODS_ID).val(response.data.methods);
    setValueIps(response.data.ipList);
    renderIps();
    $(CONST.CAPACITY_ID).val(response.data.capacity);
    $(CONST.PERIOD_ID).val(response.data.period);
    if (response.data.noContent === 1) {
        $(CONST.NO_CONTENT_ID).prop("checked", true);
    } else {
        $(CONST.NO_CONTENT_ID).prop("checked", false);
    }

    if (response.data.sandBox === 1) {
        $(CONST.SANDBOX_ID).prop("checked", true);
    } else {
        $(CONST.SANDBOX_ID).prop("checked", false);
    }
    if (response.data.debug === 1) {
        $(CONST.DEBUG_ID).prop("checked", true);
    } else {
        $(CONST.DEBUG_ID).prop("checked", false);
    }

    $(CONST.ACTIVATED_DATE_ID).val(response.data.activated);
    $(CONST.SELECT_SERVICE_ID).val(response.data.serviceId);
    $(CONST.SELECT_APPLICATION_ID).val(response.data.appId);

    if (response.data.updated !== null) {
        $(CONST.F_UPDATE_BY_ID).val(response.data.updatedBy);
        $(CONST.TIME_UPDATE_ID).val(response.data.updated);
        $(CONST.UPDATE_STATUS_ID).css("display", "block");
    }
}
