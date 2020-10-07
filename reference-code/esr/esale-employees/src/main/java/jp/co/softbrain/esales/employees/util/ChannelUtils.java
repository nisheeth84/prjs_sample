package jp.co.softbrain.esales.employees.util;

import jp.co.softbrain.esales.employees.service.dto.timelines.GetFollowedForm;
import jp.co.softbrain.esales.employees.service.dto.timelines.GetFollowedsOutDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.PathEnum;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.dto.businesscards.GetBusinessCardsTabRequest;
import jp.co.softbrain.esales.employees.service.dto.businesscards.GetBusinessCardsTabResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.FieldInfoPersonalsInputDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.GetCustomFieldsInfoRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.GetRelationDataOutDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.GetRelationDataRequest;
import jp.co.softbrain.esales.employees.service.dto.commons.GetTabsInfoResponse;
import jp.co.softbrain.esales.employees.service.dto.customers.GetCustomersOutDTO;
import jp.co.softbrain.esales.employees.service.dto.customers.GetCustomersRequest;
import jp.co.softbrain.esales.employees.service.dto.sales.GetProductTradingTabOutDTO;
import jp.co.softbrain.esales.employees.service.dto.sales.GetProductTradingTabRequest;
import jp.co.softbrain.esales.employees.service.dto.schedule.GetTaskTabOutDTO;
import jp.co.softbrain.esales.employees.service.dto.schedule.GetTasksTabRequest;
import jp.co.softbrain.esales.employees.service.dto.tenants.GetPackagesNameRequest;
import jp.co.softbrain.esales.employees.service.dto.tenants.GetPackagesNameResponse;
import jp.co.softbrain.esales.employees.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * Component for Open channel to call foregin API
 */
@Component
@XRayEnabled
public class ChannelUtils {
    private final Logger log = LoggerFactory.getLogger(ChannelUtils.class);

    @Autowired
    private RestOperationUtils restOperationUtils;

    /**
     * call api get-custom-field-info
     *
     * @param fieldInfoRequest - request for API
     * @return api response
     */
    public CommonFieldInfoResponse callAPIGetCustomFieldInfo(GetCustomFieldsInfoRequest fieldInfoRequest) {
        try {
            return restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsEmployees.API_GET_CUSTOM_FIELDS_INFO, HttpMethod.POST, fieldInfoRequest,
                    CommonFieldInfoResponse.class, SecurityUtils.getTokenValue().orElse(null),
                    TenantContextHolder.getTenant());
        } catch (Exception e) {
            throw new CustomRestException(
                    String.format(ConstantsEmployees.CALL_API_MSG_FAILED, ConstantsEmployees.API_GET_CUSTOM_FIELDS_INFO,
                            e.getLocalizedMessage()),
                    CommonUtils.putError(ConstantsEmployees.API_GET_CUSTOM_FIELDS_INFO, Constants.INTERRUPT_API));
        }
    }

    /**
     * call api get fiel-info-personal
     *
     * @param infoPersonalRequest - request for API
     * @return api response
     */
    public CommonFieldInfoResponse callAPIGetFieldInfoPersonal(FieldInfoPersonalsInputDTO infoPersonalRequest) {
        try {
            return restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsEmployees.API_GET_FIELD_INFO_PERSONAL, HttpMethod.POST, infoPersonalRequest,
                    CommonFieldInfoResponse.class, SecurityUtils.getTokenValue().orElse(null),
                    TenantContextHolder.getTenant());
        } catch (Exception e) {
            throw new CustomRestException(
                    String.format(ConstantsEmployees.CALL_API_MSG_FAILED,
                            ConstantsEmployees.API_GET_FIELD_INFO_PERSONAL, e.getLocalizedMessage()),
                    CommonUtils.putError(ConstantsEmployees.API_GET_FIELD_INFO_PERSONAL, Constants.INTERRUPT_API));
        }
    }

    /**
     * callAPICommonGetRelationData
     *
     * @param relationRequest - request for API
     * @return reponse of API
     */
    public GetRelationDataOutDTO callAPICommonGetRelationData(GetRelationDataRequest relationRequest) {
        try {
            return restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsEmployees.API_GET_RELATION_DATA, HttpMethod.POST, relationRequest,
                    GetRelationDataOutDTO.class, SecurityUtils.getTokenValue().orElse(null),
                    TenantContextHolder.getTenant());
        } catch (Exception e) {
            throw new CustomRestException(
                    String.format(ConstantsEmployees.CALL_API_MSG_FAILED, ConstantsEmployees.API_GET_RELATION_DATA,
                            e.getLocalizedMessage()),
                    CommonUtils.putError(ConstantsEmployees.API_GET_RELATION_DATA, Constants.INTERRUPT_API));
        }
    }

    /**
     * callAPIGetPackageNames
     *
     * @param packageNameRequest - request for API
     * @return response of API
     */
    public GetPackagesNameResponse callAPIGetPackageNames(GetPackagesNameRequest packageNameRequest) {
        try {
            return restOperationUtils.executeCallApi(PathEnum.TENANTS, ConstantsEmployees.URL_API_GET_PACKAGE_NAMES,
                    HttpMethod.POST, packageNameRequest, GetPackagesNameResponse.class,
                    SecurityUtils.getTokenValue().orElse(null), TenantContextHolder.getTenant());
        } catch (Exception e) {
            throw new CustomRestException(
                    String.format(ConstantsEmployees.CALL_API_MSG_FAILED, ConstantsEmployees.URL_API_GET_PACKAGE_NAMES,
                            e.getLocalizedMessage()),
                    CommonUtils.putError(ConstantsEmployees.URL_API_GET_PACKAGE_NAMES, Constants.INTERRUPT_API));
        }
    }

    /**
     * callAPIGetTabsInfo
     *
     * @return response of API
     */
    public GetTabsInfoResponse callAPIGetTabsInfo() {
        try {
            return restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS, ConstantsEmployees.API_GET_TABS_INFO,
                    HttpMethod.POST, Constants.TabBelong.EMPLOYEE.getValue(), GetTabsInfoResponse.class,
                    SecurityUtils.getTokenValue().orElse(null), TenantContextHolder.getTenant());
        } catch (Exception e) {
            throw new CustomRestException(
                    String.format(ConstantsEmployees.CALL_API_MSG_FAILED, ConstantsEmployees.API_GET_TABS_INFO,
                            e.getLocalizedMessage()),
                    CommonUtils.putError(ConstantsEmployees.API_GET_TABS_INFO, Constants.INTERRUPT_API));
        }
    }

    /**
     * callAPIGetTasksTab
     *
     * @param getTasksTabReq
     * @return responseAPI
     */
    public GetTaskTabOutDTO callAPIGetTasksTab(GetTasksTabRequest getTasksTabReq) {
        GetTaskTabOutDTO responseAPI = new GetTaskTabOutDTO();
        try {
            responseAPI = restOperationUtils.executeCallApi(PathEnum.SCHEDULES, ConstantsEmployees.API_GET_TASKS_TAB,
                    HttpMethod.POST, getTasksTabReq, GetTaskTabOutDTO.class, SecurityUtils.getTokenValue().orElse(null),
                    TenantContextHolder.getTenant());
        } catch (Exception e) {
            log.error(String.format(ConstantsEmployees.CALL_API_MSG_FAILED, ConstantsEmployees.API_GET_TASKS_TAB,
                    e.getLocalizedMessage()), e);
        }
        return responseAPI;
    }

    /**
     * callAPIGetCustomers
     *
     * @param getCustomersRequest
     * @return getCutomersResponse
     */
    public GetCustomersOutDTO callAPIGetCustomers(GetCustomersRequest getCustomersRequest) {
        GetCustomersOutDTO getCutomersResponse = new GetCustomersOutDTO();
        try {
            getCutomersResponse = restOperationUtils.executeCallApi(PathEnum.CUSTOMERS,
                    ConstantsEmployees.API_GET_CUSTOMERS, HttpMethod.POST, getCustomersRequest,
                    GetCustomersOutDTO.class, SecurityUtils.getTokenValue().orElse(null),
                    TenantContextHolder.getTenant());
        } catch (Exception e) {
            log.error(String.format(ConstantsEmployees.CALL_API_MSG_FAILED, ConstantsEmployees.API_GET_CUSTOMERS,
                    e.getLocalizedMessage()), e);
        }
        return getCutomersResponse;
    }

    /**
     * callAPIGetBusinessCardsTab
     *
     * @param businessCardTabReq
     * @return businessCardsTabResponse
     */
    public GetBusinessCardsTabResponse callAPIGetBusinessCardsTab(GetBusinessCardsTabRequest businessCardTabReq) {
        GetBusinessCardsTabResponse businessCardsTabResponse = new GetBusinessCardsTabResponse();
        try {
            businessCardsTabResponse = restOperationUtils.executeCallApi(PathEnum.BUSINESSCARDS,
                    ConstantsEmployees.API_GET_BUSINESS_CARDS_TAB, HttpMethod.POST, businessCardTabReq,
                    GetBusinessCardsTabResponse.class, SecurityUtils.getTokenValue().orElse(null),
                    TenantContextHolder.getTenant());
        } catch (Exception e) {
            log.error(String.format(ConstantsEmployees.CALL_API_MSG_FAILED,
                    ConstantsEmployees.API_GET_BUSINESS_CARDS_TAB, e.getLocalizedMessage()), e);
        }
        return businessCardsTabResponse;
    }

    /**
     * @param productTradingRequest
     * @return
     */
    public GetProductTradingTabOutDTO callAPIGetProductTradingTab(GetProductTradingTabRequest productTradingRequest) {
        GetProductTradingTabOutDTO productTradingTabResponse = new GetProductTradingTabOutDTO();
        try {
            productTradingTabResponse = restOperationUtils.executeCallApi(PathEnum.SALES,
                    ConstantsEmployees.API_GET_PRODUCT_TRADING_TAB, HttpMethod.POST, productTradingRequest,
                    GetProductTradingTabOutDTO.class, SecurityUtils.getTokenValue().orElse(null),
                    TenantContextHolder.getTenant());
        } catch (Exception e) {
            log.error(String.format(ConstantsEmployees.CALL_API_MSG_FAILED,
                    ConstantsEmployees.API_GET_BUSINESS_CARDS_TAB, e.getLocalizedMessage()), e);
        }
        return productTradingTabResponse;
    }

    /**
     * callAPIGetFollowed
     *
     * @param getFollowRequest - request to API
     * @return Response of API
     */
    public GetFollowedsOutDTO callAPIGetFollowed(GetFollowedForm getFollowRequest) {
        try {
            return restOperationUtils.executeCallApi(PathEnum.TIMELINES, ConstantsEmployees.API_GET_FOLLOWED,
                HttpMethod.POST, getFollowRequest, GetFollowedsOutDTO.class,
                SecurityUtils.getTokenValue().orElse(null), TenantContextHolder.getTenant());
        } catch (Exception e){
            throw  new CustomRestException(String.format(ConstantsEmployees.CALL_API_MSG_FAILED,
                ConstantsEmployees.API_GET_FOLLOWED, e.getLocalizedMessage()),
                CommonUtils.putError(ConstantsEmployees.API_GET_FOLLOWED, Constants.INTERRUPT_API));
        }
    }
}
