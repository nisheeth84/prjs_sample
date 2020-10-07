package com.viettel.aio.webservice;

import com.viettel.aio.business.AIOPaymentBusinessImpl;
import com.viettel.aio.config.ErrorCodeVTP;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.payment.*;
import com.viettel.asset.dto.ResultInfo;
import com.viettel.ktts2.common.BusinessException;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;

public class AIOPaymentWsRsService {

    private Logger log = Logger.getLogger(AIOPaymentWsRsService.class);

    @Autowired
    public AIOPaymentBusinessImpl aioPaymentBusiness;

    private void setResultResponse(AIOPaymentResponse res) {
        this.setResultResponse(res, null, null);
    }

    private void setResultResponse(AIOPaymentResponse res, String status, String message) {
        ResultInfo resultInfo = new ResultInfo();
        if (StringUtils.isEmpty(status)) {
            resultInfo.setStatus(ResultInfo.RESULT_OK);
        } else {
            resultInfo.setStatus(status);
            resultInfo.setMessage(message);
        }

        res.setResultInfo(resultInfo);
    }

    private String createErrorHtml(String error) {
        return  "<!DOCTYPE HTML><html lang=\"en\"><head><meta charset=\"UTF-8\">" +
                "<meta name=\"viewport\" content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\">" +
                "<meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>Hệ thống quản lý All In One(AIO)</title></head>" +
                "<body><div class=\"page-content container\" style=\"border: 2px solid #e6e9ec;background-color:#f3f5f7;font-family:Verdana, Geneva, sans-serif;\">" +
                "<h3>Có lỗi xảy ra!</h3>" + "<p>" + error + "</p>" + "</div>" +
                "<style>.container{margin-right: auto; margin-left: auto; padding-left: 15px; padding-right: 15px;}</style>" +
                "</body></html>";
    }

    @POST
    @Path("/VerifyData")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    @Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    public VTPRequest verifyData(MultivaluedMap<String, String> params) {
        log.info("========== VERIFY DATA API ==========");

        VTPRequest res = new VTPRequest();
        try {
            res = aioPaymentBusiness.verifyData(params);
        } catch (BusinessException e) {
            e.printStackTrace();
            res.setErrorCode(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage(), e);
            res.setErrorCode(ErrorCodeVTP.EXCEPTION.code);
        }

        return res;
    }

    @POST
    @Path("/GetResult")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    @Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    public VTPRequest getResult(MultivaluedMap<String, String> params) {
        log.info("========== GET RESULT API ==========");

        VTPRequest res = new VTPRequest();
        try {
            res = aioPaymentBusiness.getResult(params);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage(), e);
            res.setErrorCode(ErrorCodeVTP.NOT_OK.code);
        }

        return res;
    }

    @GET
    @Path("/Result")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    @Produces({MediaType.TEXT_HTML})
    public String redirectToResult(@QueryParam("billcode") String billCode,
                                   @QueryParam("cust_msisdn") String custMsisdn,
                                   @QueryParam("error_code") String errorCode,
                                   @QueryParam("merchant_code") String merchantCode,
                                   @QueryParam("order_id") String orderId,
                                   @QueryParam("payment_status") int paymentStatus,
                                   @QueryParam("trans_amount") String transAmount,
                                   @QueryParam("vt_transaction_id") String vtTransactionId,
                                   @QueryParam("check_sum") String checkSum) {
        log.info("========== SHOW RESULT API ==========");

        String result;
        try {
            result = aioPaymentBusiness.generateResultPage(billCode, custMsisdn, errorCode, merchantCode, orderId,
                    paymentStatus, transAmount, vtTransactionId, checkSum);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage(), e);
            result = this.createErrorHtml(e.getMessage());
        }
        return result;
    }

    @POST
    @Path("/getParams")
    @Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    public AIOPaymentResponse getParams(AIOPaymentRequest rq) {
        log.info("========== GET PARAMS API ==========");

        AIOPaymentResponse res = new AIOPaymentResponse();
        try {
            res = aioPaymentBusiness.getParams(rq);
            this.setResultResponse(res);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage(), e);
            this.setResultResponse(res, ResultInfo.RESULT_NOK, e.getMessage());
        }

        return res;
    }

    @POST
    @Path("/getTransactionResult")
    @Consumes({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    @Produces({MediaType.TEXT_HTML})
    public String getTransactionResult(AIOPaymentRequest rq) {
        log.info("========== TRANS INQUIRY API ==========");

        String result;
        try {
            result = aioPaymentBusiness.getTransactionResult(rq);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage(), e);
            result = this.createErrorHtml(e.getMessage());
        }

        return result;
    }

    @POST
    @Path("/getDataContract")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    @Produces({MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML})
    public AIOContractMobileRequest getDataContract(MultivaluedMap<String, String> params) {
        log.info("========== GET DATA CONTRACT API ==========");
        AIOContractMobileRequest res;
        try {
            res = aioPaymentBusiness.getCachedDataContract(params);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage(), e);
            res = null;
        }

        return res;
    }
}
