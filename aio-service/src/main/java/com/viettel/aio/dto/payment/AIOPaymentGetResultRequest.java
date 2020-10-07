package com.viettel.aio.dto.payment;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AIOPaymentGetResultRequest extends AIOPaymentBaseRequest {

    @JsonProperty("cust_msisdn")
    private String custMsisdn;

    @JsonProperty("payment_status")
    private Long payment_status;

    @JsonProperty("trans_amount")
    private Long transAmount;

    @JsonProperty("vt_transaction_id")
    private String vtTransactionId;

    public String getCustMsisdn() {
        return custMsisdn;
    }

    public void setCustMsisdn(String custMsisdn) {
        this.custMsisdn = custMsisdn;
    }

    public Long getPayment_status() {
        return payment_status;
    }

    public void setPayment_status(Long payment_status) {
        this.payment_status = payment_status;
    }

    public Long getTransAmount() {
        return transAmount;
    }

    public void setTransAmount(Long transAmount) {
        this.transAmount = transAmount;
    }

    public String getVtTransactionId() {
        return vtTransactionId;
    }

    public void setVtTransactionId(String vtTransactionId) {
        this.vtTransactionId = vtTransactionId;
    }
}
