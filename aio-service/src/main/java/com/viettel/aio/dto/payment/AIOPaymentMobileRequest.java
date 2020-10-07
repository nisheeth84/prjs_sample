package com.viettel.aio.dto.payment;

public class AIOPaymentMobileRequest {

    public String merchantMsisdn;
    public String merchantCode;
    public String orderId;
    public String version;
    public String type;
    public Long dailyAmountLimit;
    public Long transAmountLimit;
    public String pageSuccess;
    public String pageError;
    public String pageResult;

    private String command;
    private String senderMsisdn;
    private String pageCheckParam;
    private String token;
    private String desc;
    private Long transAmount;
    private String checkSum;

    private Long sysUserId;
    private Long contractId;
    private Long contractDetailId;
    private Long packageDetailId;

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public Long getContractDetailId() {
        return contractDetailId;
    }

    public void setContractDetailId(Long contractDetailId) {
        this.contractDetailId = contractDetailId;
    }

    public Long getPackageDetailId() {
        return packageDetailId;
    }

    public void setPackageDetailId(Long packageDetailId) {
        this.packageDetailId = packageDetailId;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public String getSenderMsisdn() {
        return senderMsisdn;
    }

    public void setSenderMsisdn(String senderMsisdn) {
        this.senderMsisdn = senderMsisdn;
    }

    public String getPageCheckParam() {
        return pageCheckParam;
    }

    public void setPageCheckParam(String pageCheckParam) {
        this.pageCheckParam = pageCheckParam;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Long getTransAmount() {
        return transAmount;
    }

    public void setTransAmount(Long transAmount) {
        this.transAmount = transAmount;
    }

    public String getCheckSum() {
        return checkSum;
    }

    public void setCheckSum(String checkSum) {
        this.checkSum = checkSum;
    }

    public String getMerchantMsisdn() {
        return merchantMsisdn;
    }

    public void setMerchantMsisdn(String merchantMsisdn) {
        this.merchantMsisdn = merchantMsisdn;
    }

    public String getMerchantCode() {
        return merchantCode;
    }

    public void setMerchantCode(String merchantCode) {
        this.merchantCode = merchantCode;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getDailyAmountLimit() {
        return dailyAmountLimit;
    }

    public void setDailyAmountLimit(Long dailyAmountLimit) {
        this.dailyAmountLimit = dailyAmountLimit;
    }

    public Long getTransAmountLimit() {
        return transAmountLimit;
    }

    public void setTransAmountLimit(Long transAmountLimit) {
        this.transAmountLimit = transAmountLimit;
    }

    public String getPageSuccess() {
        return pageSuccess;
    }

    public void setPageSuccess(String pageSuccess) {
        this.pageSuccess = pageSuccess;
    }

    public String getPageError() {
        return pageError;
    }

    public void setPageError(String pageError) {
        this.pageError = pageError;
    }

    public String getPageResult() {
        return pageResult;
    }

    public void setPageResult(String pageResult) {
        this.pageResult = pageResult;
    }
}
