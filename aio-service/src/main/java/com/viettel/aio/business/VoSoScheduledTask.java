package com.viettel.aio.business;


import com.viettel.aio.dao.AIOOrdersDAO;
import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOCustomerDTO;
import com.viettel.aio.dto.AIOOrdersDTO;
import com.viettel.aio.dto.AIOProvinceDTO;
import com.viettel.aio.dto.voso.VoSoBaseResponse;
import com.viettel.aio.dto.voso.VoSoManualDTO;
import com.viettel.aio.dto.voso.VoSoOrderDTO;
import com.viettel.aio.dto.voso.VoSoProductDTO;
import com.viettel.ktts2.common.BusinessException;
import com.viettel.utils.DateTimeUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.InetSocketAddress;
import java.net.Proxy;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Component
public class VoSoScheduledTask {

    private static final Logger log = LoggerFactory.getLogger(VoSoScheduledTask.class);

    @Autowired
    public VoSoScheduledTask(CommonServiceAio commonService, AIOOrdersDAO aioOrdersDAO) {
        this.commonService = commonService;
        this.aioOrdersDAO = aioOrdersDAO;
    }

    private CommonServiceAio commonService;
    private AIOOrdersDAO aioOrdersDAO;

    @Value("#{'${voso.host}' + '${voso.path.orderList}'}")
    private String API_GET_ORDER_LIST;

    @Value("${voso.version}")
    private String API_VERSION;

    @Value("${voso.token}")
    private String API_TOKEN;

    @Value("${system_proxy.host}")
    private String SYS_PROXY_HOST;

    @Value("${system_proxy.port}")
    private int SYS_PROXY_PORT;

    @Value("${voso.timeExecuted}")
    private int[] HOUR_EXECUTED;

    @Value("${voso.manual}")
    private String MANUAL_KEY;

    private final String CONTACT_CHANNEL = "4";
    private final Long SERVICE_ID_OTHER = 9L;
    private final String SERVICE_NAME_OTHER = "Khác";

    private SimpleClientHttpRequestFactory SYS_PROXY;
    private HttpHeaders HEADERS;

    //    @Scheduled(fixedDelay = 10000)
    @Scheduled(cron = "${voso.cronExpression}")
    public void syncDataFromVoSo() {
        log.info("=====================================");
        log.info("Start Collect data from VOSO");
        // add param
        HashMap<String, String> params = new HashMap<>();

        // startTime
        // get current hours b/c cron
        long start = DateTimeUtils.getCurrentHourOfDay();
        params.put("startChangeTime", String.valueOf(start));

        // add 3 hours
        long end = start + TimeUnit.HOURS.toMillis(3);
        params.put("endChangeTime", String.valueOf(end));

        // prepare return type
        ParameterizedTypeReference<VoSoBaseResponse<VoSoOrderDTO>> paramType = new ParameterizedTypeReference<VoSoBaseResponse<VoSoOrderDTO>>(){};
        // send request
        @SuppressWarnings("unchecked")
        VoSoBaseResponse<VoSoOrderDTO> res = this.sendRequest(API_GET_ORDER_LIST, HttpMethod.GET, params, paramType);

        // insert db
        this.insertDataOrder(res.getData().get(0));
        log.info("=====================================");
    }

    private String buildURI(String url, HashMap<String, String> map) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url).queryParam("ver", API_VERSION);
        for (HashMap.Entry<String, String> entry : map.entrySet()) {
            builder.queryParam(entry.getKey(), entry.getValue());
        }

        return builder.toUriString();
    }

    private void initSysProxy() {
        SimpleClientHttpRequestFactory clientHttpReq = new SimpleClientHttpRequestFactory();
        Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(SYS_PROXY_HOST, SYS_PROXY_PORT));
        clientHttpReq.setProxy(proxy);
        SYS_PROXY = clientHttpReq;
    }

    private HttpHeaders getDefaultHeader() {
        if (HEADERS == null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("token", API_TOKEN);

            HEADERS = headers;
        }
        return HEADERS;
    }

    @SuppressWarnings("unchecked")
    private VoSoBaseResponse sendRequest(String url, HttpMethod method, HashMap<String, String> params, ParameterizedTypeReference paramType) {
        RestTemplate restTemplate;
        if (StringUtils.isNotEmpty(SYS_PROXY_HOST) && SYS_PROXY_PORT != 0) {
            if (SYS_PROXY == null) {
                this.initSysProxy();
            }
            restTemplate = new RestTemplate(SYS_PROXY);
        } else {
            restTemplate = new RestTemplate();
        }

        String uri = this.buildURI(url, params);

        HttpEntity httpEntity = new HttpEntity(this.getDefaultHeader());
        ResponseEntity<VoSoBaseResponse> response = restTemplate.exchange(uri, method, httpEntity, paramType, params);

        return response.getBody();
    }

    private void insertDataOrder(List<VoSoOrderDTO> data) {
        List<AIOProvinceDTO> listProvince = aioOrdersDAO.getListProvince();
        Map<Long, AIOProvinceDTO> mapProvince = listProvince.stream()
                .filter(p -> p.getProvinceIdVtp() != null)
                .collect(Collectors.toMap(AIOProvinceDTO::getProvinceIdVtp, p -> p));

        List<AIOOrdersDTO> listService = aioOrdersDAO.autoSearchService();
        Map<String, String> mapService = listService.stream()
                .collect(Collectors.toMap(AIOOrdersDTO::getServiceName, AIOOrdersDTO::getCode));

        // prepare data

        for (VoSoOrderDTO order : data) {
            List<AIOOrdersDTO> dtos = aioOrdersDAO.getOrdersIdsByCode(order.getOrderCode());
            if (dtos == null || dtos.isEmpty()) {
                // insert
                this.insertNewOrder(order, mapProvince, mapService);
            } else if (order.getStatus() == 8L) {
                // update status to cancel
                aioOrdersDAO.updateCancelOrderVoSo(order.getOrderCode(), new Date());
            } else {
                // do nothing to status != 8
            }
        }
    }

    private void insertNewOrder(VoSoOrderDTO order, Map<Long, AIOProvinceDTO> mapProvince, Map<String, String> mapService) {
        AIOProvinceDTO province = mapProvince.get(order.getProvinceId().longValue());
        List<AIOOrdersDTO> list = this.toOrderDTO(order, province, mapService);
        for (AIOOrdersDTO od : list) {
            aioOrdersDAO.saveObject(od.toModel());
        }
    }

    private List<AIOOrdersDTO> toOrderDTO(VoSoOrderDTO dto, AIOProvinceDTO province, Map<String, String> mapService) {
        AIOOrdersDTO base = new AIOOrdersDTO();
        base.setOrderCodeVTP(dto.getOrderCode());
        base.setCustomerName(dto.getBuyerName());
        base.setCustomerAddress(dto.getBuyerAddress());
        base.setCustomerPhone(dto.getBuyerPhone());
        base.setContactChannel(CONTACT_CHANNEL);
        base.setStatus(dto.getStatus() == 8 ? 4L : 1L);
        base.setCreatedDate(new Date(dto.getCreateTime() * 1000));

        // map dto.getProvinceId
        if (province != null) {
            base.setCatProviceId(province.getCatProvinceId());
            base.setCatProviceCode(province.getCode());
            base.setCatProviceName(province.getName());
        }

        List<AIOOrdersDTO> ordersDTOS = new ArrayList<>();
        for (VoSoProductDTO p : dto.getProduct()) {
            AIOOrdersDTO aioOrder = new AIOOrdersDTO();
            BeanUtils.copyProperties(base, aioOrder);
            aioOrder.setQuantityTemp(p.getQuantity());
            aioOrder.setContentOrder(p.getProductName());

            if (mapService.containsKey(p.getMerchantProductId())) {
                Long serviceId = Long.parseLong(mapService.get(p.getMerchantProductId()));
                aioOrder.setServiceId(serviceId);
                aioOrder.setServiceName(p.getMerchantProductId());
            } else {
                aioOrder.setServiceId(SERVICE_ID_OTHER);
                aioOrder.setServiceName(SERVICE_NAME_OTHER);
            }

            ordersDTOS.add(aioOrder);
        }

        return ordersDTOS;
    }

    public void getDataFromVoSoManual(VoSoManualDTO dto) {
        log.info("=====================================");
        log.info("Start Collect data manual from VOSO");

        if (!MANUAL_KEY.equals(dto.getText())) {
            throw new BusinessException("Unauthorize");
        }

        // add param
        HashMap<String, String> params = new HashMap<>();
        params.put("startChangeTime", String.valueOf(dto.getStart()));
        params.put("endChangeTime", String.valueOf(dto.getEnd()));

        // prepare return type
        ParameterizedTypeReference<VoSoBaseResponse<VoSoOrderDTO>> paramType = new ParameterizedTypeReference<VoSoBaseResponse<VoSoOrderDTO>>(){};
        // send request
        @SuppressWarnings("unchecked")
        VoSoBaseResponse<VoSoOrderDTO> res = this.sendRequest(API_GET_ORDER_LIST, HttpMethod.GET, params, paramType);

        // insert db
        this.insertDataOrder(res.getData().get(0));
        log.info("=====================================");
    }
}