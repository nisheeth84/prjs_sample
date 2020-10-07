package com.viettel.aio.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.viettel.aio.config.AIOErrorType;
import com.viettel.aio.config.AIOObjectType;
import com.viettel.aio.config.CacheUtils;
import com.viettel.aio.config.ErrorCodeVTP;
import com.viettel.aio.dao.AIOContractDAO;
import com.viettel.aio.dao.AIOContractServiceMobileDAO;
import com.viettel.aio.dao.AIOTransactionDAO;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOContractMobileRequest;
import com.viettel.aio.dto.AIOTransactionDTO;
import com.viettel.aio.dto.payment.AIOPaymentMobileRequest;
import com.viettel.aio.dto.payment.AIOPaymentRequest;
import com.viettel.aio.dto.payment.AIOPaymentResponse;
import com.viettel.aio.dto.payment.VTPRequest;
import com.viettel.coms.dto.SysUserCOMSDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.utils.EncryptionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.UriBuilder;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URI;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.StringJoiner;

//VietNT_20190606_created
@Service("aioPaymentBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AIOPaymentBusinessImpl extends BaseFWBusinessImpl implements AIOPaymentBusiness {

    private Logger log = Logger.getLogger(AIOPaymentBusinessImpl.class);

    @Autowired
    public AIOPaymentBusinessImpl(AIOTransactionDAO aioTransactionDAO, AIOContractDAO aioContractDAO,
                                  CommonServiceAio commonService, AIOContractServiceMobileDAO mobileDAO,
                                  CacheUtils cacheUtils,
                                  AIOContractServiceMobileBusinessImpl mobileBusiness) {
        this.aioTransactionDAO = aioTransactionDAO;
        this.aioContractDAO = aioContractDAO;
        this.commonService = commonService;
        this.mobileDAO = mobileDAO;
        this.mobileBusiness = mobileBusiness;
        this.cacheUtils = cacheUtils;
    }

    private AIOTransactionDAO aioTransactionDAO;
    private AIOContractDAO aioContractDAO;
    private CommonServiceAio commonService;
    private AIOContractServiceMobileDAO mobileDAO;
    private AIOContractServiceMobileBusinessImpl mobileBusiness;
    private CacheUtils cacheUtils;

    @Value("#{'${vtp.url.baseVTP}' + '${vtp.url.paymentApi}'}")
    private String URL_PAYMENT_API;

    @Value("#{'${vtp.url.baseVTP}' + '${vtp.url.payment}'}")
    private String URL_VTP_PAYMENT;

    @Value("#{'${vtp.url.baseAIO}' + '${vtp.url.viewResult}'}")
    private String URL_VIEW_RESULT;

    @Value("#{'${vtp.url.baseAIO}' + '${vtp.url.getResult}'}")
    private String URL_GET_RESULT;

    @Value("#{'${vtp.url.baseAIO}' + '${vtp.url.verify}'}")
    private String URL_VERIFY;

    @Value("#{'${vtp.url.baseAIO_2}' + '${vtp.url.getDataContract}'}")
    private String URL_GET_DATA_CONTRACT;

    @Value("${vtp.const.merchant_code}")
    private String MERCHANT_CODE;

    @Value("${vtp.const.access_code}")
    private String ACCESS_CODE;

    @Value("${vtp.const.hash_key}")
    private String HASH_KEY;

    @Value("${vtp.const.version}")
    private String VERSION;

    @Value("${vtp.command.payment}")
    private String COMMAND_PAYMENT;

    @Value("${vtp.command.transInquiry}")
    private String COMMAND_TRANS_INQUIRY;

    @Value("${vtp.command.refundPayment}")
    private String REFUND_PAYMENT;

    @Value("${system_proxy.host}")
    private String SYS_PROXY_HOST;

    @Value("${system_proxy.port}")
    private int SYS_PROXY_PORT;

    private final String HTML_RESULT = "<!DOCTYPE HTML><html lang=\"en\"><head><meta charset=\"UTF-8\">" +
            "<meta name=\"viewport\" content=\"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0\">" +
            "<meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>Hệ thống quản lý All In One(AIO)</title></head>" +
            "<body><div class=\"page-content container\" style=\"border: 2px solid #e6e9ec;background-color:#f3f5f7;font-family:Verdana, Geneva, sans-serif;\">" +
            "<h3>Kết quả thanh toán</h3><p>Số ĐT trả tiền: <b>%s</b></p><p>Trạng thái: <b>%s</b></p><p>Số tiền: <b>%s</b></p>" +
            "<p>Mã giao dịch: <b>%s</b></p><p>Mã lỗi: <b>%s</b></p><br><p>Mã hợp đồng: <b>%s</b></p><p>Tên khách hàng: <b>%s</b></p>" +
            "<p>Địa chỉ: <b>%s</b></p><p>Số điện thoại khách hàng: <b>%s</b></p></div>" +
            "<style>.container{margin-right: auto; margin-left: auto; padding-left: 15px; padding-right: 15px;}</style>" +
            "</body></html>";

    private final String NOT_AVAILABLE = "N/A";

    private HashMap<Integer, String> PAYMENT_STATUSES;
    private final static String METHOD_NAME_GETPARAM = "GET_PARAM";
    private final static String METHOD_NAME_VERIFYDATA = "VERIFY_DATA";
    private final static String METHOD_NAME_TRANSINQUIRY = "TRANS_INQUIRY";
    private final static String METHOD_NAME_GETRESULT = "GET_RESULT";
    private final static String METHOD_NAME_HTMLRESULT = "HTML_RESULT";

    {
        PAYMENT_STATUSES = new HashMap<>();
        PAYMENT_STATUSES.put(-1, "Chưa phát sinh giao dịch");
        PAYMENT_STATUSES.put(0, "Giao dịch đang chờ xử lý");
        PAYMENT_STATUSES.put(1, "Giao dịch thành công");
        PAYMENT_STATUSES.put(2, "Giao dịch thất bại");
        PAYMENT_STATUSES.put(3, "Giao dịch chưa rõ kết quả");
    }

    private SimpleClientHttpRequestFactory SYS_PROXY;
    private HttpHeaders HEADERS;

    private String generateChecksum(String... params) {
        StringBuilder builder = new StringBuilder();
        for (String param : params) {
            builder.append(param);
        }
        try {
//            LOGGER.info("========== ========== ========== ==========");
//            LOGGER.info("before hash: " + builder.toString());
//            LOGGER.info("========== ========== ========== ==========");

            String result = EncryptionUtils.hmac(builder.toString(), HASH_KEY);

//            LOGGER.info("========== ========== ========== ==========");
//            LOGGER.info("hash: " + result);
//            LOGGER.info("========== ========== ========== ==========");

            return result;
        } catch (Exception e) {
            return StringUtils.EMPTY;
//            throw new BusinessException(AIOErrorType.ENCRYPT_ERROR.getContent());
        }
    }

    private VTPRequest toVTPRequest(MultivaluedMap<String, String> params) {
        VTPRequest rq = new VTPRequest();
        rq.setMerchantMsisdn(params.getFirst("merchant_msisdn"));
        rq.setMerchantCode(params.getFirst("merchant_code"));
        rq.setOrderId(params.getFirst("order_id"));
        rq.setVersion(params.getFirst("version"));
        rq.setType(params.getFirst("type"));

        String dailyLimitStr = params.getFirst("daily_amount_limit");
        rq.setDailyAmountLimit(dailyLimitStr != null ? Long.parseLong(dailyLimitStr) : null);

        String transLimitStr = params.getFirst("trans_amount_limit");
        rq.setTransAmountLimit(transLimitStr != null ? Long.parseLong(transLimitStr) : null);

        rq.setPageSuccess(params.getFirst("pageSuccess"));
        rq.setPageError(params.getFirst("pageError"));
        rq.setPageResult(params.getFirst("pageResult"));
        rq.setCustMsisdn(params.getFirst("cust_msisdn"));
        rq.setErrorCode(params.getFirst("error_code"));
        rq.setVtTransactionId(params.getFirst("vt_transaction_id"));
        rq.setToken(params.getFirst("token"));
        rq.setCommand(params.getFirst("command"));
        rq.setSenderMsisdn(params.getFirst("sender_msisdn"));
        rq.setPageCheckParam(params.getFirst("pageCheckParam"));
        rq.setDesc(params.getFirst("desc"));

        String transAmountStr = params.getFirst("trans_amount");
        rq.setTransAmount(transAmountStr != null ? Long.parseLong(transAmountStr) : null);

        rq.setCheckSum(params.getFirst("check_sum"));
        rq.setBillCode(params.getFirst("billcode"));

        try {
            if (StringUtils.isNotEmpty(params.getFirst("payment_status"))) {
                rq.setPaymentStatus(Integer.parseInt(params.getFirst("payment_status")));
            }
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }
        return rq;
    }

    ////////////////////////////////////////////////////
    public AIOPaymentResponse getParams(AIOPaymentRequest rq) {
        this.validateParams(rq);
        Long contractId = rq.getContractId();

        AIOPaymentResponse res = new AIOPaymentResponse();
        SysUserCOMSDTO criteria = new SysUserCOMSDTO();
        criteria.setSysUserId(rq.getSysUserRequest().getSysUserId());
        SysUserCOMSDTO user = commonService.getUserByCodeOrId(criteria);
        if (user == null) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.USER.getName());
        }

        AIOContractDTO contractDTO = aioContractDAO.getContractAmount(contractId);
        if (contractDTO == null || StringUtils.isEmpty(contractDTO.getContractCode()) || contractDTO.getContractId() == null) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.CONTRACT.getName());
        }
        if (contractDTO.getIsPay() != null && contractDTO.getIsPay() == 1) {
            throw new BusinessException(AIOErrorType.ALREADY_PAID.msg);
        }

        Long contractAmount = contractDTO.getContractAmount().longValue();
        if (contractDTO.getStatus() != 3) {
            AIOContractDTO keyDto = this.getUnfinishedContractDetail(contractId);
            if (keyDto == null) {
                throw new BusinessException(AIOErrorType.NOT_FOUND.msg + " thông tin gói");
            }
            AIOContractMobileRequest cacheRq = this.getCachedRequest(keyDto);
            contractAmount += cacheRq.getAioContractDTO().getAmount().longValue();
        }
        String desc = "Nộp tiền cho Hợp đồng: " + contractDTO.getContractCode();

        Long orderId = this.createTransactionCheckout(user, desc, contractDTO, contractAmount);
        commonService.validateIdCreated(orderId, AIOObjectType.TRANSACTION);

        String checkSum = this.generateChecksum(ACCESS_CODE, contractDTO.getContractCode(), COMMAND_PAYMENT,
                MERCHANT_CODE, orderId.toString(), contractAmount.toString(), VERSION);
        String requestUrl = this.createUrlCheckout(contractDTO, contractAmount, orderId, desc, checkSum);

        res.setRequestUrl(requestUrl);
        log.info(new StringJoiner(" - ")
                .add(METHOD_NAME_GETPARAM)
                .add(orderId.toString())
                .add(contractId.toString())
                .add(this.logJsonResponse(res)).toString());
        return res;
    }

    // TODO: 17-Jun-19 remove
    private <T> String logJsonResponse(T res) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        try {
            return mapper.writeValueAsString(res);
        } catch (Exception e) {
            log.info("==== mapper loi");
            return StringUtils.EMPTY;
        }
    }

    private String createUrlCheckout(AIOContractDTO contractDTO, Long contractAmount, Long orderId, String desc, String checkSum) {
        try {
//            HttpURL url = new HttpURL("http://125.235.40.34:8801/PaymentGateway/payment", "UTF-8");
//            url.setQuery("command", COMMAND_PAYMENT);
//            url.setQuery("version", VERSION);
//            url.setQuery("merchant_code", MERCHANT_CODE);
//            url.setQuery("order_id", orderId.toString());
//            url.setQuery("billcode", contractDTO.getContractCode());
//            url.setQuery("desc", desc);
//            url.setQuery("trans_amount", String.valueOf(contractDTO.getContractAmount().longValue()));
//            url.setQuery("return_url", URL_PAGE_SUCCESS);
//            url.setQuery("cancel_url", "");
//            url.setQuery("check_sum", checkSum);
            URI url = UriBuilder.fromUri(URL_VTP_PAYMENT)
                    .queryParam("command", COMMAND_PAYMENT)
                    .queryParam("version", VERSION)
                    .queryParam("merchant_code", MERCHANT_CODE)
                    .queryParam("order_id", orderId.toString())
                    .queryParam("billcode", contractDTO.getContractCode())
                    .queryParam("desc", desc)
                    .queryParam("trans_amount", contractAmount.toString())
                    .queryParam("return_url", URL_VIEW_RESULT)
                    .queryParam("check_sum", checkSum)
                    .build();

            return url.toString();

        } catch (Exception e) {
            e.printStackTrace();
            throw new BusinessException(AIOErrorType.ENCRYPT_ERROR.msg);
        }
    }

    private Long createTransactionCheckout(SysUserCOMSDTO user, String desc, AIOContractDTO contractDTO, Long contractAmount) {
        AIOTransactionDTO dto = new AIOTransactionDTO();
        dto.setSysUserPhone(user.getPhoneNumber());
        dto.setCreatedDate(new Date());
        dto.setContentPay(desc);
        dto.setContractId(contractDTO.getContractId());
        dto.setContractCode(contractDTO.getContractCode());
        dto.setAmountContract(contractAmount);

        return aioTransactionDAO.saveObject(dto.toModel());
    }

    private void validateParams(AIOPaymentRequest rq) {
        if (rq.getContractId() == null || rq.getSysUserRequest() == null || rq.getSysUserRequest().getSysUserId() == 0) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg);
        }
    }

    private void validateVerifyDataRequest(VTPRequest rq) {
        if (StringUtils.isEmpty(rq.getBillCode()) || StringUtils.isEmpty(rq.getMerchantCode())
                || StringUtils.isEmpty(rq.getOrderId()) || StringUtils.isEmpty(rq.getCheckSum())) {
            throw new BusinessException(ErrorCodeVTP.NOT_OK.code);
        }
    }

    public VTPRequest verifyData(MultivaluedMap<String, String> params) {
        VTPRequest rq = this.toVTPRequest(params);
        this.validateVerifyDataRequest(rq);

        AIOTransactionDTO transactionDTO = aioTransactionDAO.getById(rq.getOrderId());
        if (transactionDTO == null || (transactionDTO.getIsPay() != null && transactionDTO.getIsPay().equals(1L))) {
            throw new BusinessException(ErrorCodeVTP.NOT_OK.code);
        }

        String checkSum = this.generateChecksum(ACCESS_CODE, transactionDTO.getContractCode(), MERCHANT_CODE,
                transactionDTO.getAioTransactionId().toString(), transactionDTO.getAmountContract().toString());

        log.info(new StringJoiner(" - ")
                .add(METHOD_NAME_VERIFYDATA)
                .add("rq: " + rq.getCheckSum())
                .add("gen:" + checkSum)
                .add(this.logJsonResponse(transactionDTO)).toString());

        if (!checkSum.equals(rq.getCheckSum())) {
            throw new BusinessException(ErrorCodeVTP.WRONG_CHECKSUM.code);
        }

        String checkSumReturn = this.generateChecksum(ACCESS_CODE, transactionDTO.getContractCode(), ErrorCodeVTP.OK.code,
                MERCHANT_CODE, transactionDTO.getAioTransactionId().toString(), transactionDTO.getAmountContract().toString());

        VTPRequest res = new VTPRequest();
        res.setBillCode(transactionDTO.getContractCode());
        res.setMerchantCode(MERCHANT_CODE);
        res.setOrderId(transactionDTO.getAioTransactionId().toString());
        res.setTransAmount(transactionDTO.getAmountContract());
        res.setErrorCode(ErrorCodeVTP.OK.code);
        res.setCheckSum(checkSumReturn);

//        this.logJsonResponse(res);

        return res;
    }

    private void validateGetResultRequest(VTPRequest rq) {
        if (StringUtils.isEmpty(rq.getBillCode()) || StringUtils.isEmpty(rq.getMerchantCode())
                || StringUtils.isEmpty(rq.getOrderId()) || StringUtils.isEmpty(rq.getCheckSum())
                || StringUtils.isEmpty(rq.getCustMsisdn()) || StringUtils.isEmpty(rq.getErrorCode())
                || rq.getPaymentStatus() == 0 || rq.getTransAmount() == null
                || StringUtils.isEmpty(rq.getVtTransactionId())) {
            throw new BusinessException(ErrorCodeVTP.NOT_OK.code);
        }
    }

    public VTPRequest getResult(MultivaluedMap<String, String> params) {
        VTPRequest rq = this.toVTPRequest(params);
        this.validateGetResultRequest(rq);

        AIOTransactionDTO transactionDTO = aioTransactionDAO.getById(rq.getOrderId());
        if (transactionDTO == null) {
            throw new BusinessException(ErrorCodeVTP.NOT_OK.code);
        }

        String checkSum = this.generateChecksum(ACCESS_CODE, transactionDTO.getContractCode(), rq.getCustMsisdn(),
                rq.getErrorCode(), MERCHANT_CODE, rq.getOrderId(), String.valueOf(rq.getPaymentStatus()),
                rq.getTransAmount().toString(), rq.getVtTransactionId());
        if (!checkSum.equals(rq.getCheckSum())) {
            throw new BusinessException(ErrorCodeVTP.NOT_OK.code);
        }

        this.updatePaymentTransaction(transactionDTO, rq);
        if (rq.getPaymentStatus() == 1) {
            AIOContractDTO contractDTO = this.getUnfinishedContractDetail(transactionDTO.getContractId());

            log.info(new StringJoiner(" - ")
                    .add(METHOD_NAME_GETRESULT)
                    .add(transactionDTO.getAioTransactionId().toString())
                    .add(contractDTO != null ? contractDTO.getContractId().toString() : "null")
                    .add(this.logJsonResponse(contractDTO)).toString());

            // check hd chua hoan thanh, neu co thuc hien dong hd
            if (contractDTO != null) {
                AIOContractMobileRequest cachedRq = this.getCachedRequest(contractDTO);
                log.info(new StringJoiner(" - ")
                        .add(METHOD_NAME_TRANSINQUIRY)
                        .add(transactionDTO.getAioTransactionId().toString())
                        .add("cached")
                        .add(this.logJsonResponse(cachedRq)).toString());
                mobileBusiness.finishPackageInContract(cachedRq);
                mobileBusiness.updateContractPerformDateEndDate(transactionDTO.getContractId());
            }
            this.updateContractPaidStatus(transactionDTO.getContractId(), rq.getTransAmount());
        }

        String checkSumReturn = this.generateChecksum(ACCESS_CODE, ErrorCodeVTP.OK.code, MERCHANT_CODE,
                transactionDTO.getAioTransactionId().toString());
        VTPRequest res = new VTPRequest();
        res.setErrorCode(ErrorCodeVTP.OK.code);
        res.setMerchantCode(MERCHANT_CODE);
        res.setOrderId(transactionDTO.getAioTransactionId().toString());
        res.setCheckSum(checkSumReturn);
        res.setReturnUrl(StringUtils.EMPTY);
        res.setReturnOtherInfo(StringUtils.EMPTY);
        res.setReturnBillCode(StringUtils.EMPTY);

//        this.logJsonResponse(res);

        return res;
    }

    private void updatePaymentTransaction(AIOTransactionDTO transactionDTO, VTPRequest rq) {
        // update trans info
        transactionDTO.setPayPhoneVt(rq.getCustMsisdn());
        transactionDTO.setErrorCode(rq.getErrorCode());
        transactionDTO.setVtTransactionId(rq.getVtTransactionId());
        transactionDTO.setPaymentStatus((long) rq.getPaymentStatus());
        transactionDTO.setTransAmount(rq.getTransAmount());
        transactionDTO.setCheckSum(rq.getCheckSum());
        transactionDTO.setUpdateDate(new Date());
        Long result = aioTransactionDAO.updateObject(transactionDTO.toModel());
        commonService.validateIdCreated(result, ErrorCodeVTP.NOT_OK.code);
    }

    private void updateContractPaidStatus(Long contractId, Long amount) {
        // update contract
        int updateOk = aioContractDAO.updateContractPaidStatus(contractId, amount);
        commonService.validateIdCreated(updateOk, ErrorCodeVTP.NOT_OK.code);
    }

    public String getTransactionResult(AIOPaymentRequest rq) {
        if (rq.getPaymentRequest() == null || StringUtils.isEmpty(rq.getPaymentRequest().getOrderId())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg);
        }

        String orderId = rq.getPaymentRequest().getOrderId();
        AIOTransactionDTO transactionDTO = aioTransactionDAO.getById(orderId);
        if (transactionDTO == null) {
            throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.TRANSACTION);
        }

        VTPRequest res = this.sendRequestTransInquiry(orderId, transactionDTO);
        log.info(new StringJoiner(" - ")
                .add(METHOD_NAME_TRANSINQUIRY)
                .add(orderId)
                .add(transactionDTO.getContractId().toString())
                .add(this.logJsonResponse(res)).toString());

        this.validateResponseResult(res);
        this.updatePaymentTransaction(transactionDTO, res);
        if (res.getPaymentStatus() == 1 && res.getErrorCode().equals(ErrorCodeVTP.OK.code)) {
            AIOContractDTO contractDTO = aioContractDAO.getContractAmount(transactionDTO.getContractId());
            // check hd chua hoan thanh, neu co thuc hien dong hd
            if (contractDTO != null && contractDTO.getStatus() != 3) {
                AIOContractMobileRequest cachedRq = this.getCachedRequest(contractDTO);
                log.info(new StringJoiner(" - ")
                        .add(METHOD_NAME_TRANSINQUIRY)
                        .add(orderId)
                        .add("cached")
                        .add(this.logJsonResponse(cachedRq)).toString());
                mobileBusiness.finishPackageInContract(cachedRq);
                mobileBusiness.updateContractPerformDateEndDate(transactionDTO.getContractId());
            } else {
                throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.CONTRACT.getName());
            }
            this.updateContractPaidStatus(transactionDTO.getContractId(), res.getTransAmount());
            return this.createHtmlResult(transactionDTO, contractDTO, res);
        }
        throw new BusinessException("Chưa thanh toán!");
    }

    private void validateResponseResult(VTPRequest res) {
        if (StringUtils.isEmpty(res.getMerchantCode()) || StringUtils.isEmpty(res.getOrderId()) ||
                StringUtils.isEmpty(res.getErrorCode()) || StringUtils.isEmpty(res.getVtTransactionId()) ||
                StringUtils.isEmpty(res.getVersion()) || StringUtils.isEmpty(res.getCheckSum())) {
            throw new BusinessException(AIOErrorType.NOT_ENOUGH_INFO.msg + AIOObjectType.RESPONSE.getName());
        }
    }

    private VTPRequest sendRequestTransInquiry(String orderId, AIOTransactionDTO transactionDTO) {
        VTPRequest res;
        try {
            String checkSumSend = this.generateChecksum(ACCESS_CODE, COMMAND_TRANS_INQUIRY, MERCHANT_CODE, orderId, VERSION);
            LinkedMultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("cmd", COMMAND_TRANS_INQUIRY);
            map.add("merchant_code", MERCHANT_CODE);
            map.add("order_id", transactionDTO.getAioTransactionId().toString());
            map.add("version", VERSION);
            map.add("check_sum", checkSumSend);

//            SimpleClientHttpRequestFactory clientHttpReq = new SimpleClientHttpRequestFactory();
            // local proxy test
//            Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("10.61.19.195", 3128));
//            clientHttpReq.setProxy(proxy);
//
//            RestTemplate restTemplate = new RestTemplate(clientHttpReq);
//            restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());

//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON_UTF8));
//            HttpEntity<LinkedMultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);
//            res = restTemplate.postForObject(URL_PAYMENT_API, entity, VTPRequest.class);
//            ParameterizedTypeReference<VTPRequest> paramType = new ParameterizedTypeReference<VTPRequest>(){};
//            ResponseEntity<VTPRequest> response = restTemplate.exchange(URL_PAYMENT_API, HttpMethod.POST, entity, paramType);
            res = this.sendVTPayRequest(URL_PAYMENT_API, HttpMethod.POST, map);
        } catch (Exception e) {
            e.printStackTrace();
            res = null;
        }
        return res;
    }

    private String createHtmlResult(AIOTransactionDTO transactionDTO, AIOContractDTO contractDTO, VTPRequest res) {
        return this.createHtmlResult(transactionDTO, contractDTO, res.getPaymentStatus(), res.getVtTransactionId(), res.getErrorCode());
    }

    private String createHtmlResult(AIOTransactionDTO transactionDTO, AIOContractDTO contractDTO,
                                    int paymentStatus, String vtTransId, String errorCode) {
        String payPhoneVt = StringUtils.isNotEmpty(transactionDTO.getPayPhoneVt()) ? transactionDTO.getPayPhoneVt() : NOT_AVAILABLE;
        String paymentStatusStr = PAYMENT_STATUSES.get(paymentStatus);
        if (paymentStatusStr == null) {
            paymentStatusStr = NOT_AVAILABLE;
        }
        String transAmount = NOT_AVAILABLE;
        if (transactionDTO.getTransAmount() != null) {
            transAmount = String.format("%,d", transactionDTO.getTransAmount());
        }
        vtTransId = StringUtils.isNotEmpty(vtTransId) ? vtTransId : NOT_AVAILABLE;
        errorCode = StringUtils.isNotEmpty(errorCode) ? errorCode : NOT_AVAILABLE;
        String billCode = StringUtils.isNotEmpty(transactionDTO.getContractCode()) ? transactionDTO.getContractCode() : NOT_AVAILABLE;
        String cName = StringUtils.isNotEmpty(contractDTO.getCustomerName()) ? contractDTO.getCustomerName() : NOT_AVAILABLE;
        String cAddr = StringUtils.isNotEmpty(contractDTO.getCustomerAddress()) ? contractDTO.getCustomerAddress() : NOT_AVAILABLE;
        String cPhone = StringUtils.isNotEmpty(contractDTO.getCustomerPhone()) ? contractDTO.getCustomerPhone() : NOT_AVAILABLE;

        return String.format(HTML_RESULT, payPhoneVt, paymentStatusStr, transAmount, vtTransId, errorCode,
                billCode, cName, cAddr, cPhone);
    }

    public String generateResultPage(String billCode, String custMsisdn, String errorCode,
                                     String merchantCode, String orderId, int paymentStatus,
                                     String transAmount, String vtTransactionId, String checkSum) {

        String checkSumCompare = this.generateChecksum(ACCESS_CODE, billCode, custMsisdn, errorCode, MERCHANT_CODE,
                orderId, String.valueOf(paymentStatus), transAmount, vtTransactionId);

        log.info(new StringJoiner(" - ")
                .add(METHOD_NAME_HTMLRESULT)
                .add("gen:" + checkSumCompare)
                .add("billCode: " + billCode)
                .add("custMsisdn: " + custMsisdn)
                .add("errorCode: " + errorCode)
                .add("merchantCode: " + merchantCode)
                .add("orderId: " + orderId)
                .add("paymentStatus: " + paymentStatus)
                .add("transAmount: " + transAmount)
                .add("vtTransactionId: " + vtTransactionId)
                .add("checkSum: " + checkSum)
                .toString());

        if (StringUtils.isNotEmpty(custMsisdn)) {
            if (!checkSum.equals(checkSumCompare)) {
                throw new BusinessException(AIOErrorType.NOT_VALID.msg);
            }
        }

        if (errorCode.equals("W04")) {
            AIOPaymentRequest rq = new AIOPaymentRequest();
            rq.setPaymentRequest(new AIOPaymentMobileRequest());
            rq.getPaymentRequest().setOrderId(orderId);
            return this.getTransactionResult(rq);
        } else {
            AIOTransactionDTO transactionDTO = aioTransactionDAO.getById(orderId);
            if (transactionDTO == null) {
                throw new BusinessException(AIOErrorType.NOT_FOUND.msg, AIOObjectType.TRANSACTION.getName());
            }

            AIOContractDTO contractDTO = aioContractDAO.getContractAmount(transactionDTO.getContractId());
            if (contractDTO == null) {
                throw new BusinessException(AIOErrorType.NOT_FOUND.msg + AIOObjectType.CONTRACT.getName());
            }
            return this.createHtmlResult(transactionDTO, contractDTO, paymentStatus, vtTransactionId, errorCode);
        }
    }

    private AIOContractDTO getUnfinishedContractDetail(Long contractId) {
        List<AIOContractDTO> list = mobileDAO.getUnfinishedContractDetail(contractId);
        if (list == null || list.size() == 0) {
            return null;
        }
        if (list.size() > 1) {
            throw new BusinessException("HĐ chưa hoàn thành");
        }
        return list.get(0);
    }

    private AIOContractMobileRequest getCachedRequest(AIOContractDTO obj) {
        String key = mobileBusiness.createKeyEndContract(obj.getPerformerId(), obj);
        AIOContractMobileRequest rq = cacheUtils.getCacheObject(cacheUtils.REPO_END_CONTRACT_RQ, key);
        if (rq == null) {
            rq = this.getCacheRequestFromServer(obj, key);
            if (rq == null) {
                throw new BusinessException(AIOErrorType.NOT_FOUND.msg + " thông tin thanh toán");
            }
        }
        return rq;
    }

    private VTPRequest sendVTPayRequest(String url, HttpMethod method, LinkedMultiValueMap<String, String> params) {
        RestTemplate restTemplate = new RestTemplate(this.getSysProxy());
        HttpEntity<LinkedMultiValueMap<String, String>> entity = new HttpEntity<>(params, this.getDefaultHeader());
        ParameterizedTypeReference<VTPRequest> paramType = new ParameterizedTypeReference<VTPRequest>() {};
        ResponseEntity<VTPRequest> response = restTemplate.exchange(url, method, entity, paramType);
        return response.getBody();
    }

    private SimpleClientHttpRequestFactory getSysProxy() {
        if (SYS_PROXY == null) {
            if (StringUtils.isNotEmpty(SYS_PROXY_HOST) && SYS_PROXY_PORT != 0) {
                SYS_PROXY = new SimpleClientHttpRequestFactory();
                Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(SYS_PROXY_HOST, SYS_PROXY_PORT));
                SYS_PROXY.setProxy(proxy);
            } else {
                SYS_PROXY = new SimpleClientHttpRequestFactory();
            }
        }
        return SYS_PROXY;
    }

    private HttpHeaders getDefaultHeader() {
        if (HEADERS == null) {
            HEADERS = new HttpHeaders();
            HEADERS.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HEADERS.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON_UTF8));
        }
        return HEADERS;
    }

    public AIOContractMobileRequest getCachedDataContract(MultivaluedMap<String, String> params) {
        AIOPaymentMobileRequest paymentRq = new AIOPaymentMobileRequest();
        paymentRq.setSysUserId(Long.parseLong(params.getFirst("sysUserId")));
        paymentRq.setContractId(Long.parseLong(params.getFirst("contractId")));
        paymentRq.setContractDetailId(Long.parseLong(params.getFirst("contractDetailId")));
        paymentRq.setPackageDetailId(Long.parseLong(params.getFirst("packageDetailId")));
        paymentRq.setCheckSum(params.getFirst("checkSum"));

        String key = mobileBusiness.createKeyEndContract(paymentRq.getSysUserId(), paymentRq.getContractId(),
                paymentRq.getContractDetailId(), paymentRq.getPackageDetailId());
        String checkSum = this.generateChecksum(key);

        if (!checkSum.equals(paymentRq.getCheckSum())) {
            throw new BusinessException(ErrorCodeVTP.WRONG_CHECKSUM.code);
        }
        return cacheUtils.getCacheObject(cacheUtils.REPO_END_CONTRACT_RQ, key);
    }

    private AIOContractMobileRequest getCacheRequestFromServer(AIOContractDTO dto, String key) {
        String checkSum = this.generateChecksum(key);
        LinkedMultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("packageDetailId", dto.getPackageDetailId().toString());
        params.add("contractId", dto.getContractId().toString());
        params.add("contractDetailId", dto.getContractDetailId().toString());
        params.add("sysUserId", dto.getPerformerId().toString());
        params.add("checkSum", checkSum);

        RestTemplate restTemplate = new RestTemplate(this.getSysProxy());

        HttpEntity<LinkedMultiValueMap<String, String>> entity = new HttpEntity<>(params, this.getDefaultHeader());

        ParameterizedTypeReference<AIOContractMobileRequest> paramType = new ParameterizedTypeReference<AIOContractMobileRequest>() {};
        ResponseEntity<AIOContractMobileRequest> response = restTemplate.exchange(URL_GET_DATA_CONTRACT, HttpMethod.POST, entity, paramType);
        return response.getBody();
    }

    public void refundPayment() {
//        VTPRequest res;
//        try {
//            String checkSumSend = this.generateChecksum(ACCESS_CODE, COMMAND_TRANS_INQUIRY, MERCHANT_CODE, orderId, VERSION);
//            LinkedMultiValueMap<String, String> map = new LinkedMultiValueMap<>();
//            map.add("cmd", COMMAND_TRANS_INQUIRY);
//            map.add("merchant_code", MERCHANT_CODE);
//            map.add("order_id", transactionDTO.getAioTransactionId().toString());
//            map.add("version", VERSION);
//            map.add("check_sum", checkSumSend);
//
////            SimpleClientHttpRequestFactory clientHttpReq = new SimpleClientHttpRequestFactory();
//            // local proxy test
////            Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("10.61.19.195", 3128));
////            clientHttpReq.setProxy(proxy);
////
////            RestTemplate restTemplate = new RestTemplate(clientHttpReq);
////            restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
//
////            HttpHeaders headers = new HttpHeaders();
////            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
////            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON_UTF8));
////            HttpEntity<LinkedMultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);
////            res = restTemplate.postForObject(URL_PAYMENT_API, entity, VTPRequest.class);
////            ParameterizedTypeReference<VTPRequest> paramType = new ParameterizedTypeReference<VTPRequest>(){};
////            ResponseEntity<VTPRequest> response = restTemplate.exchange(URL_PAYMENT_API, HttpMethod.POST, entity, paramType);
//            res = this.sendVTPayRequest(URL_PAYMENT_API, HttpMethod.POST, map);
//        } catch (Exception e) {
//            e.printStackTrace();
//            res = null;
//        }
//        return res;
    }
}
