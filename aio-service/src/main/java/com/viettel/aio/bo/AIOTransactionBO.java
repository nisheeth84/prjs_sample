package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOTransactionDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190607_start
@Entity
@Table(name = "AIO_TRANSACTION")
public class AIOTransactionBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_TRANSACTION_SEQ")})
    @Column(name = "AIO_TRANSACTION_ID", length = 20)
    private Long aioTransactionId;
    @Column(name = "SYS_USER_PHONE", length = 20)
    private String sysUserPhone;
    @Column(name = "PAY_PHONE", length = 20)
    private String payPhone;
    @Column(name = "PAY_PHONE_VT", length = 20)
    private String payPhoneVt;
    @Column(name = "ERROR_CODE", length = 10)
    private String errorCode;
    @Column(name = "VT_TRANSACTION_ID", length = 20)
    private String vtTransactionId;
    @Column(name = "TYPE", length = 20)
    private String type;
    @Column(name = "DAILY_AMOUNT_LIMIT", length = 15)
    private Long dailyAmountLimit;
    @Column(name = "TRANS_AMOUNT_LIMIT", length = 15)
    private Long transAmountLimit;
    @Column(name = "TOKEN", length = 20)
    private String token;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
    @Column(name = "UPDATE_DATE", length = 22)
    private Date updateDate;
    @Column(name = "MERCHANT_MSISDN", length = 20)
    private String merchantMsisdn;
    @Column(name = "CONTENT_PAY", length = 50)
    private String contentPay;
    @Column(name = "TRANS_AMOUNT", length = 15)
    private Long transAmount;
    @Column(name = "CHECK_SUM", length = 50)
    private String checkSum;
    @Column(name = "CONTRACT_ID", length = 10)
    private Long contractId;
    @Column(name = "CONTRACT_CODE", length = 50)
    private String contractCode;
    @Column(name = "AMOUNT_CONTRACT", length = 15)
    private Long amountContract;
    @Column(name = "PAYMENT_STATUS", length = 1)
    private Long paymentStatus;

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
    public BaseFWDTOImpl toDTO() {
        AIOTransactionDTO dto = new AIOTransactionDTO();
        dto.setAioTransactionId(this.getAioTransactionId());
        dto.setSysUserPhone(this.getSysUserPhone());
        dto.setPayPhone(this.getPayPhone());
        dto.setPayPhoneVt(this.getPayPhoneVt());
        dto.setErrorCode(this.getErrorCode());
        dto.setVtTransactionId(this.getVtTransactionId());
        dto.setType(this.getType());
        dto.setDailyAmountLimit(this.getDailyAmountLimit());
        dto.setTransAmountLimit(this.getTransAmountLimit());
        dto.setToken(this.getToken());
        dto.setCreatedDate(this.getCreatedDate());
        dto.setUpdateDate(this.getUpdateDate());
        dto.setMerchantMsisdn(this.getMerchantMsisdn());
        dto.setContentPay(this.getContentPay());
        dto.setTransAmount(this.getTransAmount());
        dto.setCheckSum(this.getCheckSum());
        dto.setContractId(this.getContractId());
        dto.setContractCode(this.getContractCode());
        dto.setAmountContract(this.getAmountContract());
        dto.setPaymentStatus(this.getPaymentStatus());
        return dto;
    }
}
