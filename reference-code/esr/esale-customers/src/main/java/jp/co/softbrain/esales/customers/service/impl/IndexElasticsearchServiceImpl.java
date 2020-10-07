package jp.co.softbrain.esales.customers.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;

import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.customers.repository.CustomersRepository;
import jp.co.softbrain.esales.customers.security.SecurityUtils;
import jp.co.softbrain.esales.customers.service.IndexElasticsearchService;
import jp.co.softbrain.esales.customers.service.dto.CustomerIndexElasticSearchDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.GetCustomFieldsInfoRequest;
import jp.co.softbrain.esales.customers.tenant.util.CustomersCommonUtil;
import jp.co.softbrain.esales.customers.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.elasticsearch.CustomersIndexElasticsearch;
import jp.co.softbrain.esales.elasticsearch.dto.customers.CustomerElasticSearchDTO;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.DynamicDataDTO;

/**
 * ElasticsearchService
 * 
 * @author phamminhphu
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class IndexElasticsearchServiceImpl implements IndexElasticsearchService {
    private final Logger log = LoggerFactory.getLogger(IndexElasticsearchServiceImpl.class);

    public static final String GET_FIELD_INFO_ITEM_API_METHOD = "getFieldInfoItemByFieldBelong";
    public static final String CALL_API_MSG_FAILED = "Call API %s failed. Status: %s";
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private CustomersIndexElasticsearch customersIndexElasticsearch;

    @Autowired
    private CustomersRepository customersRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RestOperationUtils restOperationUtils;

    /**
     * @see IndexElasticsearchService#putIndexElasticsearch(List)
     */
    @Transactional
    public void putIndexElasticsearch(List<Long> customerIdList) {
        List<CustomerElasticSearchDTO> dataSyncElasticSearch = getCustomerElasticSearchData(customerIdList);

        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        customersIndexElasticsearch.putIndexElasticsearch(tenantName, dataSyncElasticSearch);

    }

    /**
     * @see IndexElasticsearchService#deleteIndexElasticsearch(List) (Long)
     */
    public void deleteIndexElasticsearch(List<Long> employeeIdList) {
        String tenantName = jwtTokenUtil.getTenantIdFromToken();

        customersIndexElasticsearch.deleteIndexElasticsearch(tenantName, employeeIdList);
    }

    /**
     * Get info to create on elasticsearch
     * 
     * @param customerIds
     *            list customerids
     * @return list DTO
     */
    public List<CustomerElasticSearchDTO> getCustomerElasticSearchData(List<Long> customerIds) {
        List<CustomerElasticSearchDTO> customers = new ArrayList<>();
        // 2. Get customer info by Ids
        List<CustomerIndexElasticSearchDTO> customerInputList = customersRepository
                .getDataForElasticSearch(customerIds);
        if (customerInputList == null || customerInputList.isEmpty()) {
            return customers;
        }

        // get data fieldInfo
        String token = SecurityUtils.getTokenValue().orElse(null);
        GetCustomFieldsInfoRequest getCustomFieldsInfoRequest = new GetCustomFieldsInfoRequest();
        getCustomFieldsInfoRequest.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
        CommonFieldInfoResponse fieldInfoResponse;
        List<CustomFieldsInfoOutDTO> fieldsList = null;
        try {
            fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS, "get-custom-fields-info",
                    HttpMethod.POST, getCustomFieldsInfoRequest, CommonFieldInfoResponse.class, token,
                    jwtTokenUtil.getTenantIdFromToken());
            if (fieldInfoResponse != null) {
                fieldsList = fieldInfoResponse.getCustomFieldsInfo();
            }
        } catch (RestClientException e) {
            String msg = String.format(CALL_API_MSG_FAILED, GET_FIELD_INFO_ITEM_API_METHOD, e.getMessage());
            log.error(msg);
        }
        final List<CustomFieldsInfoOutDTO> finalFieldsList = fieldsList;

        customerInputList.forEach(customerInput -> {
            CustomerElasticSearchDTO customer = new CustomerElasticSearchDTO();
            customer.setCustomerId(customerInput.getCustomerId());
            customer.setCustomerName(customerInput.getCustomerName());
            customer.setCustomerAliasName(customerInput.getCustomerAliasName());
            customer.setCustomerParent(
                    customerInput.getCustomerParent() == null ? "" : customerInput.getCustomerParent());
            customer.setZipCode(customerInput.getZipCode());
            customer.setAddress(customerInput.getAddress());
            customer.setBuilding(customerInput.getBuilding());
            // set url
            customer.setUrl(customerInput.getUrl());

            customer.setMemo(customerInput.getMemo());
            customer.setPhoneNumber(customerInput.getPhoneNumber());
            // set address
            String address = StringUtil.getFullName(customer.getZipCode(), customer.getAddress());
            address = StringUtil.getFullName(address, customer.getBuilding());

            customer.setCustomerAddress(address);
            // build customer data
            if (StringUtils.isNotBlank(customerInput.getCustomerData())) {
                try {
                    List<DynamicDataDTO> customerDataList = CustomersCommonUtil.convertCustomerDataFromString(objectMapper,
                            customerInput.getCustomerData(), null, finalFieldsList);
                    customer.setCustomerData(customerDataList);
                } catch (Exception e) {
                    log.warn(e.getLocalizedMessage());
                }
            }

            customers.add(customer);
        });

        return customers;
    }

}
