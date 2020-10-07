let pageSize = 5;

var CONST = {
    BTN_EXPORT_ID: "#btnExport",
    BTN_NEW_ID: "#btnNew"
};

$(document).ready(function () {
    $(CONST.BTN_EXPORT_ID).css("display", "none");
    $(CONST.BTN_NEW_ID).css("display", "none");
    loadData("./list", 1, pageSize);
});

function backupData() {
    $.ajax({
        url: "./backup",
        method: "get",
        success: function (response) {
            alertify.set('notifier', 'position', 'top-right');
            alertify.success('Successful!');
        },
        error: function (error) {
            alertify.error('error!');
        }
    });
}

