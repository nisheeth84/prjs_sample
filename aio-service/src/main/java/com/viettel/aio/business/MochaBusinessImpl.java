package com.viettel.aio.business;

import com.viettel.aio.dto.AIOMochaResponse;
import com.viettel.security.PassTranformer;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

import java.net.InetSocketAddress;
import java.net.Proxy;
import java.util.Collections;
import java.util.List;

//VietNT_20200203_created
@Service("mochaBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class MochaBusinessImpl extends BaseFWBusinessImpl implements MochaBusiness {

    static Logger LOGGER = LoggerFactory.getLogger(MochaBusinessImpl.class);

    @Value("${system_proxy.host}")
    private String SYS_PROXY_HOST;

    @Value("${system_proxy.port}")
    private int SYS_PROXY_PORT;

    @Value("${mocha.api.info}")
    private String API_INFO_ENC;

    @Value("${mocha.api.url}")
    private String API_URL_ENC;

    private String USERNAME;
    private String PASSWORD;
    private String SERVICE_ID;
    private String API_URL;
    private SimpleClientHttpRequestFactory SYS_PROXY;
    private HttpHeaders HEADERS;

    private void decryptConstValue() {
        String apiInfo = PassTranformer.decrypt(API_INFO_ENC);
        String[] infos = apiInfo.split("\\|");
        this.USERNAME = infos[0];
        this.PASSWORD = infos[1];
        this.SERVICE_ID = infos[2];
        this.API_URL = PassTranformer.decrypt(API_URL_ENC);
    }

    /**
     * Request API send msg mocha
     *
     * @param phoneNumbers List phone number
     * @param content      Content msg
     * @return 1: ok
     * 0: nok
     */
    @Override
    public Long sendMochaSms(List<String> phoneNumbers, String content) {
        Long result = 0L;
        if (StringUtils.isEmpty(USERNAME)) {
            this.decryptConstValue();
        }
        try {
            if (phoneNumbers != null && !phoneNumbers.isEmpty()) {
                String msisdns = String.join(",", phoneNumbers);
                LinkedMultiValueMap<String, String> params = new LinkedMultiValueMap<>();
                params.add("username", USERNAME);
                params.add("pwd", PASSWORD);
                params.add("msisdns", msisdns);
                params.add("service_id", SERVICE_ID);
                params.add("content", content);
//                res = this.sendVTPayRequest(URL_PAYMENT_API, HttpMethod.POST, map);
                RestTemplate restTemplate = new RestTemplate(this.getSysProxy());
                HttpEntity<LinkedMultiValueMap<String, String>> entity = new HttpEntity<>(params, this.getDefaultHeader());
                ParameterizedTypeReference<AIOMochaResponse> paramType = new ParameterizedTypeReference<AIOMochaResponse>() {};
                ResponseEntity<AIOMochaResponse> response = restTemplate.exchange(API_URL, HttpMethod.POST, entity, paramType);
                if (response != null && response.getBody().getError() == 200) {
                    result = 1L;
                }
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
        return result;
    }

    @Override
    public Long sendMochaSms(String phoneNumber, String content) {
        return this.sendMochaSms(Collections.singletonList(phoneNumber), content);
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
}
