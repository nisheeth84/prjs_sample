package com.viettel.vtpgw.persistence.dto.response;

import com.viettel.vtpgw.shared.utils.Constants;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseResult {
    private String statusCode;
    private String message;

    public void setSuccess(String message) {
        this.statusCode = Constants.ApiStatusCode.SUCCESS;
        this.message = message;
    }

    public void setSuccess() {
        this.statusCode = Constants.ApiStatusCode.SUCCESS;
        this.message = Constants.ApiStatusDesc.SUCCESS;
    }

    public void setError() {
        this.statusCode = Constants.ApiStatusCode.ERROR;
        this.message = Constants.ApiStatusDesc.ERROR;
    }

    public void setError(String msg) {
        this.statusCode = Constants.ApiStatusCode.ERROR;
        this.message = msg;
    }

    public void setError(String statusCode, String msg) {
        this.statusCode = statusCode;
        this.message = msg;
    }

    public void setItemNotfound(String msg) {
        this.statusCode = Constants.ApiStatusCode.NOT_FOUND;
        this.message = msg;
    }

    public void setItemNotfound() {
        this.setItemNotfound(Constants.ApiStatusDesc.NOT_FOUND);
    }
}
