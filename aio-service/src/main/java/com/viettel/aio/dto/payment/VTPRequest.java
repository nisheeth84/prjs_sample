package com.viettel.aio.dto.payment;

import org.codehaus.jackson.annotate.JsonProperty;

public class VTPRequest extends AIOPaymentBaseRequest {

    private String merchantMsisdn;
    private String merchantCode;
    private String orderId;
    private String version;
    private String type;
    private Long dailyAmountLimit;
    private Long transAmountLimit;
    private String pageSuccess;
    private String pageError;
    private String pageResult;

    private String custMsisdn;
    private String errorCode;
    private String vtTransactionId;
    private String token;

    private String command;
    private String senderMsisdn;
    private String pageCheckParam;
    private String desc;
    private Long transAmount;
    private String checkSum;

    private String billCode;
    private int paymentStatus;

    private String returnUrl;
    private String returnBillCode;
    private String returnOtherInfo;

    @JsonProperty("return_url")
    public String getReturnUrl() {
        return returnUrl;
    }

    @JsonProperty("return_bill_code")
    public String getReturnBillCode() {
        return returnBillCode;
    }

    @JsonProperty("return_other_info")
    public String getReturnOtherInfo() {
        return returnOtherInfo;
    }

    @JsonProperty("billcode")
    public String getBillCode() {
        return billCode;
    }

    @JsonProperty("payment_status")
    @com.fasterxml.jackson.annotation.JsonProperty("payment_status")
    public int getPaymentStatus() {
        return paymentStatus;
    }

    @JsonProperty("merchant_msisdn")
    public String getMerchantMsisdn() {
        return merchantMsisdn;
    }

    @JsonProperty("merchant_code")
    @com.fasterxml.jackson.annotation.JsonProperty("merchant_code")
    public String getMerchantCode() {
        return merchantCode;
    }

    @JsonProperty("order_id")
    @com.fasterxml.jackson.annotation.JsonProperty("order_id")
    public String getOrderId() {
        return orderId;
    }

    @JsonProperty("version")
    public String getVersion() {
        return version;
    }

    @JsonProperty("type")
    public String getType() {
        return type;
    }

    @JsonProperty("daily_amount_limit")
    public Long getDailyAmountLimit() {
        return dailyAmountLimit;
    }

    @JsonProperty("trans_amount_limit")
    public Long getTransAmountLimit() {
        return transAmountLimit;
    }

    public String getPageSuccess() {
        return pageSuccess;
    }

    public String getPageError() {
        return pageError;
    }

    public String getPageResult() {
        return pageResult;
    }

    @JsonProperty("cust_msisdn")
    public String getCustMsisdn() {
        return custMsisdn;
    }

    @JsonProperty("error_code")
    @com.fasterxml.jackson.annotation.JsonProperty("error_code")
    public String getErrorCode() {
        return errorCode;
    }

    @JsonProperty("vt_transaction_id")
    @com.fasterxml.jackson.annotation.JsonProperty("vt_transaction_id")
    public String getVtTransactionId() {
        return vtTransactionId;
    }

    @JsonProperty("token")
    public String getToken() {
        return token;
    }

    @JsonProperty("command")
    public String getCommand() {
        return command;
    }

    @JsonProperty("sender_msisdn")
    public String getSenderMsisdn() {
        return senderMsisdn;
    }

    public String getPageCheckParam() {
        return pageCheckParam;
    }

    public String getDesc() {
        return desc;
    }

    @JsonProperty("trans_amount")
    public Long getTransAmount() {
        return transAmount;
    }

    @JsonProperty("check_sum")
    @com.fasterxml.jackson.annotation.JsonProperty("check_sum")
    public String getCheckSum() {
        return checkSum;
    }

    public void setMerchantMsisdn(String merchantMsisdn) {
        this.merchantMsisdn = merchantMsisdn;
    }

    public void setMerchantCode(String merchantCode) {
        this.merchantCode = merchantCode;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setDailyAmountLimit(Long dailyAmountLimit) {
        this.dailyAmountLimit = dailyAmountLimit;
    }

    public void setTransAmountLimit(Long transAmountLimit) {
        this.transAmountLimit = transAmountLimit;
    }

    public void setPageSuccess(String pageSuccess) {
        this.pageSuccess = pageSuccess;
    }

    public void setPageError(String pageError) {
        this.pageError = pageError;
    }

    public void setPageResult(String pageResult) {
        this.pageResult = pageResult;
    }

    public void setCustMsisdn(String custMsisdn) {
        this.custMsisdn = custMsisdn;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public void setVtTransactionId(String vtTransactionId) {
        this.vtTransactionId = vtTransactionId;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public void setSenderMsisdn(String senderMsisdn) {
        this.senderMsisdn = senderMsisdn;
    }

    public void setPageCheckParam(String pageCheckParam) {
        this.pageCheckParam = pageCheckParam;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public void setTransAmount(Long transAmount) {
        this.transAmount = transAmount;
    }

    public void setCheckSum(String checkSum) {
        this.checkSum = checkSum;
    }

    public void setBillCode(String billCode) {
        this.billCode = billCode;
    }

    public void setPaymentStatus(int paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public void setReturnUrl(String returnUrl) {
        this.returnUrl = returnUrl;
    }

    public void setReturnBillCode(String returnBillCode) {
        this.returnBillCode = returnBillCode;
    }

    public void setReturnOtherInfo(String returnOtherInfo) {
        this.returnOtherInfo = returnOtherInfo;
    }
}
