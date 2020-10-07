var pageSize = 5;
var existName = false;
var CONST = {
    PAGING_ID: '#pagination',
    NAME_SPACE_MODAL_ID: '#nameModalSpace',
    MODULE_ID: '#module',
    TOGGLE_AREA_ID: '#toggleArea',
    EDIT_BUTTON_ID: '#editButton',
    END_POINTS_ID: '#endPoints',
    ERR_END_POINTS_ID: '#errEndPoints',
    PARAMETERS_ID: '#parameters',
    RESP_PARAMS_ID: '#respParams',
    IDLE_TIMEOUT: '#idleTimeout',
    MODAL_SERVICE_ID: '#modalService',
    STANDARD_DURATION: '#standardDuration',
    LIST_SERVICES_ID: '#listServices',
    SERVICE_NODE_ID: '#serviceNode',
    CHART_LIST_ID: '#chartList',
    START_DATE_ID: '#startDate',
    END_DATE_ID: '#endDate',
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
    BTN_REMOVE_ID: '#btnRemove',
    BTN_SUBMIT_FORM_ID: "#btnSubmitForm",
    LIST_APPLICATION_ID: "#listApplication",
    TOTAL_APPLICATION_ID: "#totalApplication",
    MODAL_TITLE_ID: "#modalTitle",
    PASSWORD_CONTAINER_ID: "#passwordContainer",
    CONNECT_TIME_OUT_ID: "#connectTimeout",
    TIME_OUT_ID: "#timeout",
    CONTACT_ID: "#contact",
    TOKEN_ID: "#token",
    APP_ID: "#appId",
    F_ID: "#f-id",
    F_SERVICE_ID: "#f-serviceId",
    CREATE_BY_ID: "#createdBy",
    STATUS_ID: "#status",
    UPDATED_BY_ID: "#updatedBy",
    TIME_UPDATE_ID: "#timeUpdated",
    TOTAL_RECORD_ID: "#totalRecord",
    EMAIL_ID: "#email",
    PHONE_ID: "#phone",
    FULL_NAME_ID: "#fullname",
    SALT_ID: "#salt",
    PASSWORD_ID: "#password",
    FORM_ACCOUNT_ID: "#formAccount",
    ADDRESS_ID: "#address",
    MODAL_CONTACT_ID: "#modalContact",
    METHODS_ID: "#methods",
    PERIOD_ID: "#period",
    IPS_ID: "#ips",
    ERR_IPS_ID: "#errIps",
    SELECT_NODE_ID: "#selectNode",
    FORM_SERVICE_ID: "#formService",
    DESCRIPTION_ID: "#description",
    NAME_ID: "#name",
    REPORT_INTERVAL_ID: "#reportInterval",
    MESSRES: "#messRes"
};

const endPoints = [
    {
        "id": "",
        "serviceId": [""],
        "url": "",
        "checkUrl": "",
        "status": "1"
    },
];


$(document).ready(function () {
        $(CONST.BTN_BACKUP_ID).css("display", "none");
        $(CONST.BTN_RELOAD_ID).css("display", "none");
        $(CONST.BTN_EXPORT_ID).css("display", "none");
        importBtn = $(CONST.BTN_IMPORT_ID);
        importBtn.on('change', function () {
            importDataFromFile();
        });
        loadData("./list", 1, pageSize, false);
    }
);

function pagination(totalAccount, url, page, pageSize, checkPage) {
    var totalPage = Math.ceil(totalAccount / pageSize);
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

function loadData(url, page, pageSize, checkLoad) {
    $.ajax({
        url: url,
        data: {page: page, pageSize: pageSize},
        success: function (response) {
            let html = ``;
            if (response.statusCode === "200") {
                response.listData.forEach(service => {
                    html += (`
                <tr id="toggleArea" onclick="buttonClickEvent(this.id,'${service.id}', event);">
                    <td>
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="cb-${service.id}">
                            <label class="custom-control-label" for="cb-${service.id}"></label>
                        </div>
                    </td>
                    <td style="width: 23%;">${service.name}</td>
                    <td style="width: 15%;">${service.module}</td>
                     <td style="width: 40%;">${service.contact}</td>
                `);
                    if (service.status === 1) {
                        html += `<td style="width: 15%;"> Activate</td>`
                    }
                    if (service.status === 0) {
                        html += `<td style="width: 15%;">Disable</td>`
                    }
                    html += (`
                    <td style="width: 7%;">
                        <img id="buttonEdit" onclick="buttonClickEvent(this.id,'${service.id}', event);" class="img-edit" width="20px" height="20px" src="../img/icon-edit.JPG"
                                   title="update service">
                   </td>
                </tr>
                <tr id="${service.id}" style="display: none;">
                    <td colspan="6">
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Capacity:</label>
                            <label class="col-2">${service.capacity}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Connected timeout:</label>
                            <label class="col-8">${service.connectTimeout}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Created by:</label>
                            <label class="col-8">${service.createdBy}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Contact:</label>
                            <label class="col-8">${service.contact}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Description:</label>
                            <label class="col-8">${service.description}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Module:</label>
                            <label class="col-8">${service.module}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Period:</label>
                            <label class="col-8">${service.period}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Standard Duration:</label>
                            <label class="col-8">${service.standardDuration}</label>
                        </div>
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Report Interval:</label>
                            <label class="col-8">${service.reportInterval}</label>
                        </div>
                        `);

                    if (service.status === 1) {
                        html += `
                            <div class="row">
                                <div class="col-1"></div>
                                <label class="col-2">Status:</label>
                                <label class="col-8">Activate</label>
                            </div>
                                    `
                    }

                    if (service.status === 0) {
                        html += `
                            <div class="row">
                                <div class="col-1"></div>
                                <label class="col-2">Status:</label>
                                <label class="col-8">Disable</label>
                            </div>
                                        `
                    }
                    if (service.updated === null) {
                        html += `
                            <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Updated:</label>
                            <label class="col-8"></label>
                        </div>     `
                    } else {
                        html += `
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Updated:</label>
                            <label class="col-8">${service.updated}</label>
                        </div> `
                    }
                    html += (`
                        <div class="row">
                            <div class="col-1"></div>
                            <label class="col-2">Updated by:</label>
                            <label class="col-8">${service.updatedBy}</label>
                        </div>
                    </td>                    
                </tr>
                `);
                });
            }
            $(CONST.LIST_SERVICES_ID).html(html);
            $(CONST.TOTAL_RECORD_ID).html(response.totalRow);
            pagination(response.totalRow, url, page, pageSize, checkLoad);
        }
    });
}

function search() {
    let keyword = $(CONST.BTN_SEARCH_ID).val();
    let isSearchMode = true;
    let url = "./search?keyword=" + keyword;
    if (keyword.length === 0) {
        url = "./list";
    }
    loadData(url, 1, pageSize, isSearchMode);
}

function resetModal() {
    $(CONST.F_ID).val("");
    endPoints.length = 0;
    endPoints.push({
        "id": "",
        "serviceId": "",
        "url": "",
        "checkUrl": "",
        "status": "0"
    });
    $(CONST.FORM_SERVICE_ID).removeClass('was-validated');
    $(CONST.FORM_SERVICE_ID)[0].reset();
    $(CONST.MESSRES).html('');
    $(CONST.NAME_ID).css("border-color", "#ced4da");
    $(CONST.UPDATE_STATUS_ID).css("display", "none");
}

function createService() {
    $.ajax({
        url: "./add",
        method: "post",
        contentType: "application/json; charset=utf-8",
        data: bindModalDataToServiceJson(),
        success: function (response) {
            ajaxCrudSuccessHandler(response, CONST.MODAL_SERVICE_ID, function () {
                loadData("./list", 1, pageSize, true)
            }, resetModal());
        },
        error: function (error) {
            ajaxErrorHandler(error);
        }
    });
}

function updateService() {
    $.ajax({
        url: "./update",
        method: "post",
        contentType: "application/json; charset=utf-8",
        data: bindModalDataToServiceJson(),
        success: function (response) {
            ajaxCrudSuccessHandler(response, CONST.MODAL_SERVICE_ID, function () {
                loadData("./list", 1, pageSize)
            }, resetModal());
        },
        error: function (error) {
            ajaxErrorHandler(error);
        }
    });
}

function submitForm() {
    updateValueEndPoints();
    let id = $(CONST.F_ID).val();
    if (id === "") {
        createService();
    } else {
        updateService();
    }
}

function showModal(id = null) {
    $(CONST.NAME_SPACE_MODAL_ID).css("display", "block");
    resetModal();
    this.renderEndpoints();
    if (id != null) {
        $(CONST.MODAL_TITLE_ID).html("Update service");
        $(CONST.BTN_SUBMIT_FORM_ID).html("Update");
        $(CONST.PASSWORD_CONTAINER_ID).css("display", "none");
        $(CONST.NAME_SPACE_MODAL_ID).css("display", "none");
        $.ajax({
            url: "./findById",
            method: "get",
            data: {id: id},
            dataType: "json",
            success: function (response) {
                if (response.statusCode === "200") {
                    bindServiceDataToModal(response)
                }
            },
            error: function (error) {
                ajaxErrorHandler(error);
            },
            async: false
        });
    } else {
        $(CONST.MODAL_SERVICE_ID).css("display", "block");
        $(CONST.MODAL_TITLE_ID).html("Create service");
        $(CONST.BTN_SUBMIT_FORM_ID).html("Save");
    }

    $(CONST.MODAL_SERVICE_ID).modal({show: true});
}

function addTableRow(id) {
    switch (id) {
        case "respParams":
            respParams.push({
                "name": "",
                "value": ""
            });
            renderRespParams();
            break;
        case "parameters":
            params.push({
                "name": "",
                "value": ""
            });
            renderParams();
            break;
        case "endPoints":
            updateValueEndPoints();
            endPoints.push({
                "id": "",
                "serviceId": "",
                "url": "",
                "checkUrl": "",
                "status": "0"
            });
            renderEndpoints();
            break;
    }
}

function renderEndpoints() {
    let html = "";
    endPoints.forEach((item, index) => {
        html += `<div class="item-endpoint form-group row no-gutter" style="height: 40px">
                    <div class="col-lg-3">
                        <input style="width: 95%; border: none; border-bottom: solid 1px #ccc" class="form-control"
                               name="url" value="${item.url}", pattern="^\\S+$"
                               placeholder="url" required/>
                        <div class="invalid-feedback">No, you missed this one.</div>
                    </div>
                    <div class="col-lg-3 p-0">
                        <input style="width: 95%; border: none; border-bottom: solid 1px #ccc" class="form-control"
                               name="checkUrl" pattern="^\\S+$" value="${item.checkUrl}"
                               placeholder="check url" required/>
                        <div class="invalid-feedback">No, you missed this one.</div>
                    </div>
                    <div class="col-lg-6 mt-1" >
                        <select style="width: 40%; border: none; border-bottom: solid 1px #ccc; display: inline-block;" class="form-control"
                        name="endpointStatus">
                            <option value="0" ${item.status === "0" ? "selected=\"selected\"" : ""} >Disable</option>
                            <option value="1" ${item.status === "1" ? "selected=\"selected\"" : ""} selected>Activate</option>
                        </select>
                        <div class="float-right mt-2">
                            <button type="button" class="border-0 mt-1" style="background-color: white" title="move up"><i
                                    class="fas fa-chevron-up"></i></button>
                            <button type="button" class="border-0" style="background-color: white" title="move down"><i
                                    class="fas fa-chevron-down"></i></button>
                            <button id="btnRemove" type="button" class="border-0" style="background-color: white" title="remove" onclick="deleteValueEndPoint(${index})">
                                    <i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                </div>`;
    });
    html += (`
              <div id="errEndPoints"></div>
              <div class="seperate pt-2"></div>
              <button type="button" onclick="addTableRow('endPoints')" class="border-0 float-right" style="background-color: white">
                   <img width="30" height="30" src="../img/icon_add.png"/>
              </button>`);
    $(CONST.END_POINTS_ID).html(html);
    checkButtonRemove(endPoints.length, CONST.BTN_REMOVE_ID)
}

function updateValueEndPoints() {
    var url = $('input[name ="url"]');
    var checkUrl = $('input[name ="checkUrl"]');
    var status = document.getElementsByName('endpointStatus');
    for (i = 0; i < endPoints.length; i++) {
        endPoints[i].url = url[i].value;
        endPoints[i].checkUrl = checkUrl[i].value;
        endPoints[i].status = status[i].value;
    }
}

function setValueEndPoints(values) {
    endPoints.splice(0, endPoints.length);
    values.forEach(value =>
        endPoints.push({
            "id": value.id,
            "serviceId": value.serviceId,
            "url": value.url,
            "checkUrl": value.checkUrl,
            "status": value.status
        })
    );
}

function deleteValueEndPoint(index) {
    updateValueEndPoints();
    endPoints.splice(index, 1);
    renderEndpoints();
}

function showImportDialog() {
    importBtn.click();
}

function checkExistName() {
    let keyword = $(CONST.NAME_ID).val();
    let id = $(CONST.F_ID).val();
    if (id === "") {
        $.ajax({
            url: "./checkExistName",
            method: "get",
            async: false,
            contentType: "application/json; charset=utf-8",
            data: {name: keyword},
            success: function (response) {
                if (response === true) {
                    let html = `<span style="color: red; font-size: small">Name is existed!</span>`
                    $(CONST.MESSRES).html(html);
                    $(CONST.NAME_ID).css("border-color", "#dc3545");
                    //$(CONST.NAME_ID).css("background-image", `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23dc3545' viewBox='-2 -2 7 7'%3e%3cpath stroke='%23dc3545' d='M0 0l3 3m0-3L0 3'/%3e%3ccircle r='.5'/%3e%3ccircle cx='3' r='.5'/%3e%3ccircle cy='3' r='.5'/%3e%3ccircle cx='3' cy='3' r='.5'/%3e%3c/svg%3E")`);
                    existName = true;
                } else {
                    $(CONST.MESSRES).html('');
                    $(CONST.NAME_ID).css("border-color", "");
                    existName = false;
                }
            },
        });
    } else {
        existName = false;
    }
}

$(CONST.BTN_SUBMIT_FORM_ID).click(function (event) {
    let checkEndPoint = true;
    if (endPoints.length > 1) {
        checkEndPoint = validateDuplicate('input[name ="url"]');
    }
    // Fetch form to apply custom Bootstrap validation
    let form = $(CONST.FORM_SERVICE_ID);

    if (form[0].checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.addClass('was-validated');
    checkExistName();
    if (form[0].checkValidity() === true && !existName) {
        console.log("Submitting");
        if (checkEndPoint) {
            submitForm();
        } else {
            $(CONST.ERR_END_POINTS_ID).html('<p style="color: red; font-size: small">url duplicate</p>')
            ajaxErrorHandler("error !");
        }
    }
});

function bindServiceDataToModal(response) {
    $(CONST.F_ID).val(response.data.id);
    $(CONST.F_SERVICE_ID).val(response.data.serviceId);
    $(CONST.NAME_ID).val(response.data.name);
    $(CONST.DESCRIPTION_ID).val(response.data.description);
    $(CONST.CONTACT_ID).val(response.data.contact);
    $(CONST.MODULE_ID).val(response.data.module);
    $(CONST.IDLE_TIMEOUT).val(response.data.idleTimeout);
    $(CONST.TIME_OUT_ID).val(response.data.timeout);
    $(CONST.CAPACITY_ID).val(response.data.capacity);
    $(CONST.PERIOD_ID).val(response.data.period);
    $(CONST.STANDARD_DURATION).val(response.data.standardDuration);
    if (response.data.endpoints.length != 0) {
        setValueEndPoints(response.data.endpoints);
        renderEndpoints();
    } else {
        renderEndpoints();
    }
    $(CONST.CREATE_BY_ID).val(response.data.createdBy);
    if (response.data.status === 1) {
        $(CONST.STATUS_ID).val(1);
    } else {
        $(CONST.STATUS_ID).val(0);
    }
    if (response.data.updatedTime !== null) {
        $(CONST.UPDATED_BY_ID).val(response.data.updatedBy);
        $(CONST.TIME_UPDATE_ID).html(response.data.updatedTime);
    }
    $(CONST.REPORT_INTERVAL_ID).val(response.data.reportInterval)
}

function bindModalDataToServiceJson() {
    return JSON.stringify({
        id: $(CONST.F_ID).val(),
        serviceId: $(CONST.F_SERVICE_ID).val(),
        name: $(CONST.NAME_ID).val(),
        description: $(CONST.DESCRIPTION_ID).val(),
        module: $(CONST.MODULE_ID).val(),
        timeout: $(CONST.TIME_OUT_ID).val(),
        capacity: $(CONST.CAPACITY_ID).val(),
        period: $(CONST.PERIOD_ID).val(),
        contact: $(CONST.CONTACT_ID).val(),
        standardDuration: $(CONST.STANDARD_DURATION).val(),
        reportInterval: $(CONST.REPORT_INTERVAL_ID).val(),
        status: $(CONST.STATUS_ID).val(),
        endpoints: endPoints
    });
}
