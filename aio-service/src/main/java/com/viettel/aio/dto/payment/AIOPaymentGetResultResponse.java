package com.viettel.aio.dto.payment;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AIOPaymentGetResultResponse extends AIOPaymentBaseResponse {

    @JsonProperty("return_url")
    private String returnUrl;

    @JsonProperty("return_bill_code")
    private String returnBillCode;

    @JsonProperty("return_other_info")
    private String returnOtherInfo;

    public String getReturnUrl() {
        return returnUrl;
    }

    public void setReturnUrl(String returnUrl) {
        this.returnUrl = returnUrl;
    }

    public String getReturnBillCode() {
        return returnBillCode;
    }

    public void setReturnBillCode(String returnBillCode) {
        this.returnBillCode = returnBillCode;
    }

    public String getReturnOtherInfo() {
        return returnOtherInfo;
    }

    public void setReturnOtherInfo(String returnOtherInfo) {
        this.returnOtherInfo = returnOtherInfo;
    }
}
