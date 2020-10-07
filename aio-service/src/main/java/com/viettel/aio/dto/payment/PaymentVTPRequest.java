package com.viettel.aio.dto.payment;

import org.codehaus.jackson.annotate.JsonProperty;

import java.io.Serializable;

public class PaymentVTPRequest implements Serializable {

    private String merchantMsisdn;
    private String command;
    private String senderMsisdn;
    private String merchantCode;
    private String orderId;
    private String version;
    private String pageCheckParam;
    private String token;
    private String desc;
    private Double transAmount;
    private String checkSum;

    @JsonProperty("merchant_msisdn")
    public String getMerchantMsisdn() {
        return merchantMsisdn;
    }

    @JsonProperty("command")
    public String getCommand() {
        return command;
    }

    @JsonProperty("sender_msisdn")
    public String getSenderMsisdn() {
        return senderMsisdn;
    }

    @JsonProperty("merchant_code")
    public String getMerchantCode() {
        return merchantCode;
    }

    @JsonProperty("order_id")
    public String getOrderId() {
        return orderId;
    }

    @JsonProperty("version")
    public String getVersion() {
        return version;
    }

    @JsonProperty("pageCheckParam")
    public String getPageCheckParam() {
        return pageCheckParam;
    }

    @JsonProperty("token")
    public String getToken() {
        return token;
    }

    @JsonProperty("desc")
    public String getDesc() {
        return desc;
    }

    @JsonProperty("trans_amount")
    public Double getTransAmount() {
        return transAmount;
    }

    @JsonProperty("check_sum")
    public String getCheckSum() {
        return checkSum;
    }

    public void setMerchantMsisdn(String merchantMsisdn) {
        this.merchantMsisdn = merchantMsisdn;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public void setSenderMsisdn(String senderMsisdn) {
        this.senderMsisdn = senderMsisdn;
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

    public void setPageCheckParam(String pageCheckParam) {
        this.pageCheckParam = pageCheckParam;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public void setTransAmount(Double transAmount) {
        this.transAmount = transAmount;
    }

    public void setCheckSum(String checkSum) {
        this.checkSum = checkSum;
    }
}
