package com.viettel.aio.dto.payment;

import com.viettel.aio.dto.AIOTokenDTO;
import com.viettel.asset.dto.ResultInfo;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;

public class AIOPaymentResponse extends AIOPaymentBaseRequest {

    private List<AIOTokenDTO> tokens;

    private ResultInfo resultInfo;

    private PaymentInfoDTO paymentInfo;

    private VTPRequest vtpResponse;

    private HashMap<String, String> requestParams;

    private String requestUrl;

    public String getRequestUrl() {
        return requestUrl;
    }

    public void setRequestUrl(String requestUrl) {
        this.requestUrl = requestUrl;
    }

    public HashMap<String, String> getRequestParams() {
        return requestParams;
    }

    public void setRequestParams(HashMap<String, String> requestParams) {
        this.requestParams = requestParams;
    }

    public VTPRequest getVtpResponse() {
        return vtpResponse;
    }

    public void setVtpResponse(VTPRequest vtpResponse) {
        this.vtpResponse = vtpResponse;
    }

    public PaymentInfoDTO getPaymentInfo() {
        return paymentInfo;
    }

    public void setPaymentInfo(PaymentInfoDTO paymentInfo) {
        this.paymentInfo = paymentInfo;
    }

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }

    public List<AIOTokenDTO> getTokens() {
        return tokens;
    }

    public void setTokens(List<AIOTokenDTO> tokens) {
        this.tokens = tokens;
    }
}
