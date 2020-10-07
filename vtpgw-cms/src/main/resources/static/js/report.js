var pageSize = 5;
let isSearchMode = false;
var idEndPoint = 0;
var currentServiceName = "";
var nodeSelected = false;
var CONST = {
    PAGING_ID: '#pagination',
    LIST_REPORTS_ID: '#listReports',
    LIST_SERVICES_ID: '#listServices',
    CHART_LIST_ID: '#chartList',
    START_DATE_ID: '#startDate',
    END_DATE_ID: '#endDate',
    MODAL_REPORT_ID: '#modalReport',
    F_UPDATE_BY_ID: '#f-updatedBy',
    BTN_BACKUP_ID: "#btnBackup",
    BTN_RELOAD_ID: "#btnReload",
    MODAL_TITLE_ID: "#modalTitle",
    CREATE_STATUS_ID: "#createdStatus",
    PASSWORD_CONTAINER_ID: "#passwordContainer",
    UPDATE_STATUS_ID: "#updateStatus",
    F_ID: "#f-id",
    UPDATED_BY_ID: "#updatedBy",
    TIME_UPDATE_ID: "#timeUpdated",
    LIST_ACCOUNT_ID: "#listAccounts",
    TOTAL_RECORD_ID: "#totalRecords",
    MODAL_ACCOUNT_ID: "#modalAccount",
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
    SELECT_NODE_ID: "#selectNode"
};
var importBtn;

const endPoints = [
    {
        "id": "",
        "url": "",
        "checkUrl": "",
        "status": "1",
        "idTemp": idEndPoint
    },
];

$(document).ready(function () {
        $(CONST.BTN_BACKUP_ID).css("display", "none");
        $(CONST.BTN_RELOAD_ID).css("display", "none");
        loadData("../service/list", 1, pageSize);
    }
);


function selectNode(){
    let nodeName = $(CONST.SELECT_NODE_ID).val();
    let url = "./searchByServiceNameAndNodeUrl?nodeUrl=" + nodeName;
    if(nodeName === " "){
        nodeSelected = false;
        url = "./search2";
    }
    url = encodeURI(url);
    nodeSelected = true;
    showModal(currentServiceName,url);
}

function search() {
    let startDate = $(CONST.START_DATE_ID).val();
    let endDate = $("#endDate").val();
    var url = "";

    if(startDate.length !== 0 && endDate.length === 0){
        url = "./search2?startTime=" + startDate;
    } else if(startDate.length !== 0 && endDate.length !== 0){
        url = "./search2?startTime=" + startDate + "&endTime=" + endDate;
    } else if(startDate.length === 0 && endDate.length !== 0) {
        url = "./search2?endTime=" + endDate;
    }  else if (startDate.length === 0 || endDate.length === 0) {
        isSearchMode = false;
        url = "./search2";
    } else {
        isSearchMode = true;
    }
    url = encodeURI(url);
    showModal(currentServiceName,url);
}

function pagination(totalAccount, url, page, pageSize) {
    var totalPage = Math.ceil(totalAccount / pageSize);

    if (isSearchMode || nodeSelected) {
        isSearchMode = false;
        nodeSelected = false;
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
            if(page > 1){
                loadData(url, page, pageSize);
            }
        }
    });
}

function resetApplicationModal() {
    $(CONST.F_ID).val("");
    // $("#formApplication")[0].reset();
    $(CONST.UPDATE_STATUS_ID).css("display", "none");
}

function showModal(serviceName,url) {
    if (serviceName != null) {
        $(CONST.CHART_LIST_ID).html('');
        $(CONST.MODAL_TITLE_ID).html("Chart");
        $(CONST.CREATE_STATUS_ID).css("display", "block");
        $(CONST.PASSWORD_CONTAINER_ID).css("display", "none");
        $.ajax({
            url: url,
            method: "get",
            data: {serviceName: serviceName, page: 1, pageSize: 100},
            dataType: "json",
            success: function (reportResponse) {
                var html = '';
                var listNode = [];
                reportResponse.listData.forEach(function (report) {
                    listNode.push(report.nodeUrl);
                    html += (`
                        <tr>
                            <td style="width: 13%;">${report.serviceName}</td>
                            <td style="width: 20%;"></td>
                            <td style="width: 25%;">${report.executionTime}</td>
                            <td style="width: 17%;">${report.responseTime}</td>
                            <td style="width: 35%;">${report.nodeUrl}</td>
                        </tr>
                    `);
                });
                $(CONST.LIST_REPORTS_ID).html(html);
                getDataChart(serviceName,url);

                if (currentServiceName === serviceName) {

                }
            },
            error: function (error) {
                var html = '';
                $(CONST.LIST_REPORTS_ID).html(html);
                alertify.error("no report");
            }
        });
    }

    $(CONST.MODAL_REPORT_ID).modal({show: true});
}

function initDropdownNodes(listNodeName) {
    var htmlListNodes = ('<option value=" "> </option>');
    listNodeName.forEach(function (e) {
        htmlListNodes += (`<option value="${e}">${e}</option>`);
    });
    $(CONST.SELECT_NODE_ID).html(htmlListNodes);
}

function isReopen(nodeName) {
    return currentServiceName != null && currentServiceName === nodeName;
}


function getDataChart(serviceName,url) {
    $.ajax({
        url: url,
        method: "get",
        data: {serviceName: serviceName, page: 1, pageSize: 1000},
        dataType: "json",
        success: function (reportResponse) {
            var tempName = '';
            var nodes = {};
            var listNodeName = [];
            reportResponse.listData.forEach(function (report) {
                if (report.nodeUrl === tempName) {
                    nodes[report.nodeUrl].labels.push(report.executionTime);
                    nodes[report.nodeUrl].datas.push(report.responseTime);
                } else {
                    tempName = report.nodeUrl;
                    listNodeName.push(tempName);
                    nodes[report.nodeUrl] = {
                        labels: [report.executionTime],
                        datas: [report.responseTime]
                    };
                }
            });

            if (!isReopen(serviceName)) {
                currentServiceName = serviceName;
                initDropdownNodes(listNodeName);
            }

            listNodeName.forEach(function (e) {
                //tao html cho node
                // load data to chart
                let chartId = 'myChart' + e;
                $(CONST.CHART_LIST_ID).append('<canvas id=' + chartId + '></canvas>');
                //... id chart + e.name ==> id
                loadChart(nodes[e].labels, nodes[e].datas, e);
            });
        }
    });
}

function loadChart(labels, data, nodeName) {
    new Chart(document.getElementById('myChart' + nodeName).getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: nodeName,
                    xAxisID: 'xAxis1',
                    data: data,
                    backgroundColor: window.chartColors.green,
                    borderColor: window.chartColors.green,
                    fill: false,
                    pointHitRadius: 40
                }
            ]
        },
        options:{
            scales:{
                xAxes:[
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'Execution Time'
                        },
                        id:'xAxis1',
                        type:"category",
                        display: true
                    }
                ],
                yAxes:[{
                    scaleLabel: {
                        display: true,
                        labelString: 'Response Time'
                    },
                    ticks:{
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}

function loadData(url, page, pageSize) {
    $.ajax({
        url: url,
        data: {page: page, pageSize: pageSize},
        success: function (serviceResponse) {
            var html = '';
            serviceResponse.listData.forEach(function (service) {
                html += (`
                    <tr onclick="showModal('${service.name}','/report/search2')">
                        <td style="width: 40%;">${service.name}</td>
                        <td style="width: 15%;">${service.module}</td>
                        <td style="width: 20%;">${service.createdBy}</td>
                    `);
                if (service.status === 1) {
                    html += `<td style="width: 15%;">Activated</td>`
                }
                if (service.status === 0) {
                    html += `<td style="width: 15%;">Disabled</td>`
                }
                html += (`
                    </tr>
                    `);
            });

            $(CONST.LIST_SERVICES_ID).html(html);
            pagination(serviceResponse.totalRow, url, page, pageSize);
        }
    });
}

function showImportDialog() {
    importBtn.click();
}
