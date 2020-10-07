package com.viettel.aio.dto.payment;

public class TestResponse extends AIOPaymentBaseRequest {
    private VTPRequest vtpRequest;
    private String errorCode;
    private String value;
    private String orderId;
    private String message;

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public VTPRequest getVtpRequest() {
        return vtpRequest;
    }

    public void setVtpRequest(VTPRequest vtpRequest) {
        this.vtpRequest = vtpRequest;
    }
}
