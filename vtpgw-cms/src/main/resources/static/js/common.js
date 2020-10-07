function importDataFromFile() {
  let files = importBtn[0].files;
  let errors = "";

  if (!files) {
    errors += "Browser does not support, please use Chrome or Firefox!";
  }

  if (files.length > 1) {
    alertify.error("Exceeded the number of files allowed: 1");
    importBtn.val('');
    return;
  }

  if (files && files[0]) {
    let file = files[0];

    if ((/\.(json)$/i).test(file.name)) {
      sendDataToServer(file);
    } else {
      errors += "Please import a valid json file";
    }
  }

  // Handle errors
  if (errors) {
    alertify.error(errors);
    importBtn.val('');
  }

function sendDataToServer(file) {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.addEventListener("load", function () {
      $.ajax({
        url: "./import",
        method: "post",
        contentType: "application/json; charset=utf-8",
        data: reader.result,
        success: function (response) {
          if (response.statusCode === "200") {
            console.log('success');
            loadData("./list", 1, pageSize, true);
            alertify.success("successfully imported " + response.data + " records!");
            importBtn.val('');
          }
          // if (response.statusCode === "400") {
          //   loadData("./list", 1, pageSize);
          //   alertify.error(response.dataSuccess.length + " imported!");
          //   importBtn.val('');
          // }
        },
        error: function (error) {
          ajaxErrorHandler(error);
          importBtn.val('');
        }
      });
    });
  }
}

function checkButtonRemove(length, idButton) {
    if(length === 1){
        $(idButton).attr('disabled', true);
    }
}

function validateDuplicate(listData){
    let flagValidate = true;
    var listDatas = $(listData);
    for (var index = 0; index < listDatas.length - 1; index++){
        if(listDatas[index].value === ""){
            continue;
        }else {
            for (var indexNext = index + 1; indexNext < listDatas.length; indexNext++){
                if(listDatas[index].value === listDatas[indexNext].value){
                    flagValidate = false;
                    break;
                }
            }
        }
        if(!flagValidate){
            break;
        }
      }
    return flagValidate;
}

function ajaxCrudSuccessHandler(response, modalId, callback, msgSuccess, msgError) {
  if (response.statusCode === "200") {
    $(modalId).modal("hide");
    alertify.success(msgSuccess != null ? msgSuccess : 'successful!');
    callback();
    // loadData("/permission/findAll", 1, pageSize);
    // resetModal();
  } else {
    msgError = msgError != null ? msgError : "error";
    alertify.error((response.message != null) ? response.message : msgError);
  }
}

function ajaxErrorHandler(error) {
  alertify.error(error != null ? error.responseJSON.messages.toString() : "error!");
}

$(document).on("keypress", "form", function(event) {
    return event.keyCode != 13;
});
