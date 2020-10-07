package jp.co.softbrain.esales.tenants.util;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.tenants.security.SecurityUtils;
import jp.co.softbrain.esales.tenants.service.dto.LanguagesDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantEnvironmentDTO;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.CountUsedLicensesPackageDTO;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.CountUsedLicensesResponse;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.CreateCustomerRequest;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.CreateCustomerResponse;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.CreateDepartmentRequest;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.CreateDepartmentResponse;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.CreateEmployeeInfo;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.CreateEmployeeResponse;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.CreateProductInfo;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.CreateProductResponse;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.EmployeeDepartmentDTO;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.GetLanguagesResponse;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.HolidaysDTO;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.RevokeEmployeeAccessRequest;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.RevokeEmployeeAccessResponse;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.UpdateHolidaysRequest;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.UpdateHolidaysResponse;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.UpdatePeriodRequest;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.UpdatePeriodResponse;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.UpdatePositionsDTO;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.UpdatePositionsRequest;
import jp.co.softbrain.esales.tenants.service.dto.externalservices.UpdatePositionsResponse;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * TenantRestOperationUtil
 *
 * @author tongminhcuong
 */
@Component
public class TenantRestOperationUtil {

    private static final String REVOKE_EMPLOYEE_ACCESS_API = "revoke-employee-access";

    private static final String CREATE_DEPARTMENT_API = "create-department";

    private static final String UPDATE_POSITIONS_API = "update-positions";

    private static final String CREATE_EMPLOYEE_API = "create-employee";

    private static final String CREATE_PRODUCT_API = "create-product";

    private static final String UPDATE_PERIOD_API = "update-periods";

    private static final String UPDATE_HOLIDAY_API = "update-holidays";

    private static final String CREATE_CUSTOMER_API = "create-customer";

    private static final String COUNT_USED_LICENSES_API = "count-used-licenses";

    private static final String API_NAME_GET_LANGUAGES = "get-languages";

    private final Logger log = LoggerFactory.getLogger(TenantRestOperationUtil.class);

    @Autowired
    private RestOperationUtils restOperationUtils;

    /**
     * Call API revoke-employee-access
     *
     * @param tenantName The name of tenant target
     * @param packageIdList List package id
     * @return isSuccess
     */
    public Boolean revokeEmployeeAccess(String tenantName, List<Long> packageIdList) {
        // build request
        RevokeEmployeeAccessRequest revokeEmployeeAccessRequest = new RevokeEmployeeAccessRequest();
        revokeEmployeeAccessRequest.setPackageIds(packageIdList);

        RevokeEmployeeAccessResponse response = restOperationUtils.executeCallApi(
                Constants.PathEnum.EMPLOYEES,
                REVOKE_EMPLOYEE_ACCESS_API,
                HttpMethod.POST,
                revokeEmployeeAccessRequest,
                RevokeEmployeeAccessResponse.class,
                SecurityUtils.getTokenValue().orElse(null),
                tenantName);

        log.debug("\n\n\n\n============\n\tREVOKE EMPLOYEE ACCESS RES : {}\n================", response);

        return response.getIsSuccess();
    }

    /**
     * Call API createDepartment
     *
     * @param tenantName The name of tenant target
     * @param departmentName Name of department
     * @param parentId parentId
     * @return department_id
     */
    public Long createDepartment(String tenantName, String departmentName, Long parentId) {
        // build request
        CreateDepartmentRequest createDepartmentRequest = new CreateDepartmentRequest();
        createDepartmentRequest.setDepartmentName(departmentName);
        createDepartmentRequest.setParentId(parentId);

        CreateDepartmentResponse response = restOperationUtils.executeCallApi(
                Constants.PathEnum.EMPLOYEES,
                CREATE_DEPARTMENT_API,
                HttpMethod.POST,
                createDepartmentRequest,
                CreateDepartmentResponse.class,
                SecurityUtils.getTokenValue().orElse(null),
                tenantName);

        log.debug("\n\n\n\n============\n\tCREATE DEPARTMENT RES : {}\n================", response);

        return response.getDepartmentId();
    }

    /**
     * Call API updatePositions
     *
     * @param tenantName The name of tenant target
     * @param positionName Name of position
     * @param isAvailable isAvailable
     * @return position_id
     */
    public Long updatePositions(String tenantName, String positionName, boolean isAvailable) {
        // build request
        UpdatePositionsRequest updatePositionsRequest = new UpdatePositionsRequest();
        UpdatePositionsDTO updatePositionsDTO = new UpdatePositionsDTO();
        updatePositionsDTO.setPositionId(0L);
        updatePositionsDTO.setPositionName(positionName);
        updatePositionsDTO.setIsAvailable(isAvailable);
        updatePositionsRequest.setPositions(Collections.singletonList(updatePositionsDTO));

        UpdatePositionsResponse response = restOperationUtils.executeCallApi(
                Constants.PathEnum.EMPLOYEES,
                UPDATE_POSITIONS_API,
                HttpMethod.POST,
                updatePositionsRequest,
                UpdatePositionsResponse.class,
                SecurityUtils.getTokenValue().orElse(null),
                tenantName);

        log.debug("\n\n\n\n============\n\tUPDATE POSITIONS RES : {}\n================", response);

        return response.getInsertedPositions().get(0);
    }

    /**
     * Call API createEmployee
     *
     * @param tenantEnvironment tenantEnvironment
     * @param languageId languageId
     * @param packageIdList packageIdList
     * @param departmentId departmentId
     * @param positionId positionId
     * @return employee_id
     */
    public Long createEmployee(TenantEnvironmentDTO tenantEnvironment, Long languageId,
            List<Long> packageIdList, Long departmentId, Long positionId) {
        // build request
        CreateEmployeeInfo createEmployeeInfo = new CreateEmployeeInfo();
        createEmployeeInfo.setEmployeeSurname(tenantEnvironment.getEmployeeSurname());
        createEmployeeInfo.setEmployeeName(tenantEnvironment.getEmployeeName());
        createEmployeeInfo.setEmail(tenantEnvironment.getEmail());
        createEmployeeInfo.setTelephoneNumber(tenantEnvironment.getTelephoneNumber());
        createEmployeeInfo.setIsAdmin(true);
        createEmployeeInfo.setIsAccessContractSite(true);
        createEmployeeInfo.setLanguageId(languageId);
        createEmployeeInfo.setPackageIds(packageIdList);
        createEmployeeInfo.setEmployeeDepartments(
                Collections.singletonList(new EmployeeDepartmentDTO(departmentId, positionId)));

        CreateEmployeeResponse response = restOperationUtils.executeCallApiWithFormData(
                Constants.PathEnum.EMPLOYEES,
                CREATE_EMPLOYEE_API,
                createEmployeeInfo,
                CreateEmployeeResponse.class,
                SecurityUtils.getTokenValue().orElse(null),
                tenantEnvironment.getTenantName());

        log.debug("\n\n\n\n============\n\tCREATE EMPLOYEE RES : {}\n================", response);

        return response.getEmployeeId();
    }

    /**
     * Call API create-product
     *
     * @param tenantName tenantName
     * @param productName productName
     * @return product_id
     */
    public Long createProduct(String tenantName, String productName) {
        // build request
        CreateProductInfo createProductInfo = new CreateProductInfo();
        createProductInfo.setProductName(productName);

        CreateProductResponse response = restOperationUtils.executeCallApiWithFormData(
                Constants.PathEnum.PRODUCTS,
                CREATE_PRODUCT_API,
                createProductInfo,
                CreateProductResponse.class,
                SecurityUtils.getTokenValue().orElse(null),
                tenantName);

        log.debug("\n\n\n\n============\n\tCREATE PRODUCT RES : {}\n================", response);

        return response.getProductId();
    }

    /**
     * Call API update-period
     *
     * @param tenantName tenantName
     * @param monthBegin monthBegin
     * @param isCalendarYear isCalendarYear
     * @return period_id
     */
    public Long updatePeriod(String tenantName, Integer monthBegin, boolean isCalendarYear) {
        // build request
        UpdatePeriodRequest updatePeriodRequest = new UpdatePeriodRequest();
        updatePeriodRequest.setMonthBegin(monthBegin);
        updatePeriodRequest.setIsCalendarYear(isCalendarYear);

        UpdatePeriodResponse response = restOperationUtils.executeCallApi(
                Constants.PathEnum.SCHEDULES,
                UPDATE_PERIOD_API,
                HttpMethod.POST,
                updatePeriodRequest,
                UpdatePeriodResponse.class,
                SecurityUtils.getTokenValue().orElse(null),
                tenantName);

        log.debug("\n\n\n\n============\n\tUPDATE PERIOD RES : {}\n================", response);

        return response.getPeriodId();
    }

    /**
     * Call API update-holiday
     *
     * @param tenantName tenantName
     * @param dayStart dayStart
     * @return holiday_id
     */
    public Long updateHoliday(String tenantName, Integer dayStart) {
        // build request
        HolidaysDTO holidaysDTO = new HolidaysDTO(dayStart);
        UpdateHolidaysRequest updateHolidayRequest = new UpdateHolidaysRequest(holidaysDTO);

        UpdateHolidaysResponse response = restOperationUtils.executeCallApi(
                Constants.PathEnum.SCHEDULES,
                UPDATE_HOLIDAY_API,
                HttpMethod.POST,
                updateHolidayRequest,
                UpdateHolidaysResponse.class,
                SecurityUtils.getTokenValue().orElse(null),
                tenantName);

        log.debug("\n\n\n\n============\n\tUPDATE HOLIDAY RES : {}\n================", response);

        return response.getHolidayId();
    }

    /**
     * Call API create-customer
     *
     * @param tenantName tenantName
     * @param businessMainId businessMainId
     * @param businessSubId businessSubId
     * @return customer_id
     */
    public Long createCustomer(String tenantName, String customerName, Long businessMainId, Long businessSubId) {
        // build request
        CreateCustomerRequest createCustomerRequest = new CreateCustomerRequest();
        createCustomerRequest.setCustomerName(customerName);
        createCustomerRequest.setBusinessMainId(businessMainId);
        createCustomerRequest.setBusinessSubId(businessSubId);

        CreateCustomerResponse response = restOperationUtils.executeCallApiWithFormData(
                Constants.PathEnum.CUSTOMERS,
                CREATE_CUSTOMER_API,
                createCustomerRequest,
                CreateCustomerResponse.class,
                SecurityUtils.getTokenValue().orElse(null),
                tenantName);

        log.debug("\n\n\n\n============\n\tCREATE CUSTOMER RES : {}\n================", response);

        return response.getCustomerId();
    }

    /**
     * Call API count-used-licenses
     *
     * @param tenantName tenantName
     * @return list of packages
     */
    public List<CountUsedLicensesPackageDTO> countUsedLicenses(String tenantName) {
        CountUsedLicensesResponse response = restOperationUtils.executeCallApi(
                Constants.PathEnum.EMPLOYEES,
                COUNT_USED_LICENSES_API,
                HttpMethod.POST,
                new HashMap<>(), // no body
                CountUsedLicensesResponse.class,
                SecurityUtils.getTokenValue().orElse(null),
                tenantName);

        log.debug("\n\n\n\n============\n\tCOUNT USED LICENSES API RES : {}\n================", response);

        return response.getPackages();
    }

    /**
     * Call service common to get LanguagesDTO
     *
     * @param tenantName name of tenant
     * @return List {@link LanguagesDTO}
     */
    public List<LanguagesDTO> getLanguages(String tenantName) {
        // Call api getLanguages
        GetLanguagesResponse responseLanguage = restOperationUtils.executeCallApi(
                Constants.PathEnum.COMMONS,
                API_NAME_GET_LANGUAGES,
                HttpMethod.POST,
                null,
                GetLanguagesResponse.class,
                SecurityUtils.getTokenValue().orElse(null),
                tenantName);

        return responseLanguage.getLanguagesDTOList();
    }
}
