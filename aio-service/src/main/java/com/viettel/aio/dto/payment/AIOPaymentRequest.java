package com.viettel.aio.dto.payment;

import com.viettel.aio.dto.AIOTokenDTO;
import com.viettel.aio.dto.SysUserRequest;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.io.Serializable;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOPaymentRequest implements Serializable {

    public SysUserRequest sysUserRequest;

    public AIOPaymentMobileRequest paymentRequest;

    public Long tokenId;

    public Long contractId;

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public Long getTokenId() {
        return tokenId;
    }

    public void setTokenId(Long tokenId) {
        this.tokenId = tokenId;
    }

    public SysUserRequest getSysUserRequest() {
        return sysUserRequest;
    }

    public void setSysUserRequest(SysUserRequest sysUserRequest) {
        this.sysUserRequest = sysUserRequest;
    }

    public AIOPaymentMobileRequest getPaymentRequest() {
        return paymentRequest;
    }

    public void setPaymentRequest(AIOPaymentMobileRequest paymentRequest) {
        this.paymentRequest = paymentRequest;
    }
}
