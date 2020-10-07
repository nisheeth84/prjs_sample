package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOTransactionBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190607_create
@XmlRootElement(name = "AIO_TRANSACTIONBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOTransactionDTO extends ComsBaseFWDTO<AIOTransactionBO> {

    public AIOTransactionDTO() {}

    public AIOTransactionDTO(Long aioTransactionId) {
        this.aioTransactionId = aioTransactionId;
    }

    private Long aioTransactionId;
    private String sysUserPhone;
    private String payPhone;
    private String payPhoneVt;
    private String errorCode;
    private String vtTransactionId;
    private String type;
    private Long dailyAmountLimit;
    private Long transAmountLimit;
    private String token;
    private Date createdDate;
    private Date updateDate;
    private String merchantMsisdn;
    private String contentPay;
    private Long transAmount;
    private String checkSum;
    private Long contractId;
    private String contractCode;
    private Long amountContract;
    private Long paymentStatus;

    private Long isPay;

    public Long getIsPay() {
        return isPay;
    }

    public void setIsPay(Long isPay) {
        this.isPay = isPay;
    }

    public Long getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(Long paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Long getAioTransactionId() {
        return aioTransactionId;
    }

    public void setAioTransactionId(Long aioTransactionId) {
        this.aioTransactionId = aioTransactionId;
    }

    public String getSysUserPhone() {
        return sysUserPhone;
    }

    public void setSysUserPhone(String sysUserPhone) {
        this.sysUserPhone = sysUserPhone;
    }

    public String getPayPhone() {
        return payPhone;
    }

    public void setPayPhone(String payPhone) {
        this.payPhone = payPhone;
    }

    public String getPayPhoneVt() {
        return payPhoneVt;
    }

    public void setPayPhoneVt(String payPhoneVt) {
        this.payPhoneVt = payPhoneVt;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getVtTransactionId() {
        return vtTransactionId;
    }

    public void setVtTransactionId(String vtTransactionId) {
        this.vtTransactionId = vtTransactionId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public String getMerchantMsisdn() {
        return merchantMsisdn;
    }

    public void setMerchantMsisdn(String merchantMsisdn) {
        this.merchantMsisdn = merchantMsisdn;
    }

    public String getContentPay() {
        return contentPay;
    }

    public void setContentPay(String contentPay) {
        this.contentPay = contentPay;
    }

    public String getCheckSum() {
        return checkSum;
    }

    public void setCheckSum(String checkSum) {
        this.checkSum = checkSum;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public String getContractCode() {
        return contractCode;
    }

    public void setContractCode(String contractCode) {
        this.contractCode = contractCode;
    }

    public Long getAmountContract() {
        return amountContract;
    }

    public void setAmountContract(Long amountContract) {
        this.amountContract = amountContract;
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

    public Long getTransAmount() {
        return transAmount;
    }

    public void setTransAmount(Long transAmount) {
        this.transAmount = transAmount;
    }

    @Override
    public AIOTransactionBO toModel() {
        AIOTransactionBO bo = new AIOTransactionBO();
        bo.setAioTransactionId(this.getAioTransactionId());
        bo.setSysUserPhone(this.getSysUserPhone());
        bo.setPayPhone(this.getPayPhone());
        bo.setPayPhoneVt(this.getPayPhoneVt());
        bo.setErrorCode(this.getErrorCode());
        bo.setVtTransactionId(this.getVtTransactionId());
        bo.setType(this.getType());
        bo.setDailyAmountLimit(this.getDailyAmountLimit());
        bo.setTransAmountLimit(this.getTransAmountLimit());
        bo.setToken(this.getToken());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setUpdateDate(this.getUpdateDate());
        bo.setMerchantMsisdn(this.getMerchantMsisdn());
        bo.setContentPay(this.getContentPay());
        bo.setTransAmount(this.getTransAmount());
        bo.setCheckSum(this.getCheckSum());
        bo.setContractId(this.getContractId());
        bo.setContractCode(this.getContractCode());
        bo.setAmountContract(this.getAmountContract());
        bo.setPaymentStatus(this.getPaymentStatus());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return aioTransactionId;
    }

    @Override
    public String catchName() {
        return aioTransactionId.toString();
    }
}
