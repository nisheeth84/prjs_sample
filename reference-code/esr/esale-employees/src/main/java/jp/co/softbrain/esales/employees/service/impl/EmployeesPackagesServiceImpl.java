package jp.co.softbrain.esales.employees.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.domain.EmployeesPackages;
import jp.co.softbrain.esales.employees.repository.EmployeesPackagesRepository;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.EmployeesPackagesService;
import jp.co.softbrain.esales.employees.service.LicenseService;
import jp.co.softbrain.esales.employees.service.TmsService;
import jp.co.softbrain.esales.employees.service.dto.CountUsedLicensesOutDTO;
import jp.co.softbrain.esales.employees.service.dto.CountUsedLicensesSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackageSumIdsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackagesDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.ValidateResponse;
import jp.co.softbrain.esales.employees.service.dto.tenants.GetStatusContractRequest;
import jp.co.softbrain.esales.employees.service.dto.tenants.ServicesByPackageIdDataDTO;
import jp.co.softbrain.esales.employees.service.dto.tenants.StatusContractDataDTO;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesPackagesMapper;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.employees.web.rest.vm.request.GetServicesByPackageIdsRequest;
import jp.co.softbrain.esales.employees.web.rest.vm.response.CheckInvalidLicenseResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetServicesByPackageIdsResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.RevokeEmployeeAccessResponse;
import jp.co.softbrain.esales.tms.TransIDHolder;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.commons.ValidateRequest;

/**
 * Service Implementation for managing {@link EmployeesPackages}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class EmployeesPackagesServiceImpl implements EmployeesPackagesService {

    private final EmployeesPackagesMapper employeesPackagesMapper;
    private static final String NOT_HAVE_PERMISSION = "User does not have permission.";
    private static final String ITEM_VALUE_INVALID = "Item's value invalid";
    private static final String VALIDATE_FAIL = "Validate failded.";

    private static final String PACKAGE_IDS = "packageIds";
    private static final String EMPLOYEE_ID = "employeeId";

    @Autowired
    private TmsService tmsService;

    @Autowired
    private EmployeesPackagesRepository employeesPackagesRepository;

    @Autowired
    private LicenseService licenseService;

    public EmployeesPackagesServiceImpl(EmployeesPackagesRepository employeesPackagesRepository,
            EmployeesPackagesMapper employeesPackagesMapper) {
        this.employeesPackagesRepository = employeesPackagesRepository;
        this.employeesPackagesMapper = employeesPackagesMapper;
    }

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesPackagesService#save(jp.co.softbrain.esales.employees.service.dto.EmployeesPackagesDTO)
     */
    @Override
    public EmployeesPackagesDTO save(EmployeesPackagesDTO employeesPackagesDTO) {
        EmployeesPackages employeesPackages = employeesPackagesMapper.toEntity(employeesPackagesDTO);
        employeesPackages = employeesPackagesRepository.save(employeesPackages);
        return employeesPackagesMapper.toDto(employeesPackages);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesPackagesService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<EmployeesPackagesDTO> findAll(Pageable pageable) {
        return employeesPackagesRepository.findAll(pageable).map(employeesPackagesMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesPackagesService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeesPackagesDTO> findAll() {
        return employeesPackagesRepository.findAll().stream().map(employeesPackagesMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesPackagesService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<EmployeesPackagesDTO> findOne(Long id) {
        EmployeesPackages employeesPackages = employeesPackagesRepository.findByEmployeePackageId(id);
        if (employeesPackages != null) {
            return Optional.of(employeesPackages).map(employeesPackagesMapper::toDto);
        }
        return Optional.empty();
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesPackagesService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        employeesPackagesRepository.deleteById(id);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesPackagesService#getSumEmployeePackageByIds(java.util.List<Long>)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeesPackageSumIdsDTO> getSumEmployeePackageByIds(List<Long> packageIds) {
        return employeesPackagesRepository.getSumEmployeePackageByIds(packageIds);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesPackagesService#getSumEmployeePackage()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeesPackageSumIdsDTO> getSumEmployeePackage() {
        return employeesPackagesRepository.getSumEmployeePackage();
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesPackagesService#deleteByEmployeeId(java.lang.Long)
     */
    @Override
    public void deleteByEmployeeId(Long employeeId) {
        if (StringUtil.isEmpty(TransIDHolder.getTransID())) { // @TMS
            employeesPackagesRepository.deleteByEmployeeId(employeeId);
        } else {
            tmsService.deleteEmployeePackageByEmployeeId(employeeId, TransIDHolder.getTransID());
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#countUsedLicenses()
     */
    @Override
    public CountUsedLicensesOutDTO countUsedLicenses() {
        CountUsedLicensesOutDTO countUsedLicensesOutDTO = new CountUsedLicensesOutDTO();
        // 1. Check role user
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException(NOT_HAVE_PERMISSION,
                    CommonUtils.putError(ConstantsEmployees.EMPLOYEE_CAPTION, Constants.USER_NOT_PERMISSION));
        }
        // Group and count package_id in employees_packages
        List<CountUsedLicensesSubType1DTO> packagesDto = employeesPackagesRepository.countUsedLicenses();
        countUsedLicensesOutDTO.setPackages(packagesDto);
        return countUsedLicensesOutDTO;
    }

    /**
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     * @see jp.co.softbrain.esales.employees.service.EmployeesCommonService#revokeEmployeeAccess(java.util.List)
     */
    @Override
    public RevokeEmployeeAccessResponse revokeEmployeeAccess(List<Long> packageIds) {
        RevokeEmployeeAccessResponse revokeEmployeeAccessResponse = new RevokeEmployeeAccessResponse();
        revokeEmployeeAccessResponse.setIsSuccess(false);

        // 1. Validate parameters
        if (packageIds == null || packageIds.isEmpty()) {
            throw new CustomRestException(ITEM_VALUE_INVALID,
                    CommonUtils.putError(PACKAGE_IDS, Constants.RIQUIRED_CODE));
        }

        // validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        List<Map<String, Object>> customParams = new ArrayList<>();
        packageIds.forEach(packageId -> {
            Map<String, Object> customField = new HashMap<>();
            customField.put("packageId", packageId);
            customParams.add(customField);
        });
        String validateJson = jsonBuilder.build(FieldBelong.EMPLOYEE.getValue(), null, customParams);
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        String token = SecurityUtils.getTokenValue().orElse(null);
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException(VALIDATE_FAIL, response.getErrors());
        }

        // 2. Revoke access to the employee account for packages
        employeesPackagesRepository.deleteByPackageIdNotIn(packageIds);
        revokeEmployeeAccessResponse.setIsSuccess(true);

        // 3. Create response data for the API
        return revokeEmployeeAccessResponse;
    }

    /*
     * (non-Javadoc)
     * @see jp.co.softbrain.esales.employees.service.EmployeesPackagesService#
     * getServices(java.lang.Long, java.lang.String, java.lang.String)
     */
    @Override
    public GetServicesByPackageIdsResponse getServices(Long employeeId, String token, String tenantId) {

        // 1. Validate parameters
        if (employeeId == null) {
            throw new CustomRestException(ITEM_VALUE_INVALID,
                    CommonUtils.putError(EMPLOYEE_ID, Constants.RIQUIRED_CODE));
        }

        if (StringUtils.isBlank(token)) {
            token = SecurityUtils.getTokenValue().orElse(null);
        }
        if (StringUtils.isBlank(tenantId)) {
            tenantId = jwtTokenUtil.getTenantIdFromToken();
        }

        // get packageIds
        StatusContractDataDTO statusContract = restOperationUtils.executeCallApi(Constants.PathEnum.TENANTS, "get-status-contract",
                HttpMethod.POST, new GetStatusContractRequest(tenantId),
                StatusContractDataDTO.class, token, tenantId);
        List<Long> packageIds = new ArrayList<>();
        if (statusContract != null && statusContract.getContractStatus() != 3) {
            employeesPackagesRepository.findByEmployeeId(employeeId)
                    .forEach(packageInfo -> packageIds.add(packageInfo.getPackageId()));
        }

        if (!packageIds.isEmpty()) {
            GetServicesByPackageIdsRequest request = new GetServicesByPackageIdsRequest();
            request.setPackageIds(packageIds);

            GetServicesByPackageIdsResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.TENANTS,
                    ConstantsEmployees.URL_API_GET_SERVICES_BY_PACKAGE, HttpMethod.POST, request,
                    GetServicesByPackageIdsResponse.class, token, tenantId);
            
            CheckInvalidLicenseResponse checkLicenseResponse = licenseService.checkInvalidLicense(tenantId);
            if (Boolean.TRUE.equals(checkLicenseResponse.getIsInvalidLicense())) {
                ServicesByPackageIdDataDTO employeeService = response.getData().stream()
                        .filter(service -> service.getServiceId() == 8L).findFirst().orElse(null);
                List<ServicesByPackageIdDataDTO> newServiceList = new ArrayList<>();
                newServiceList.add(employeeService);
                response.setData(newServiceList);
            }
            
            return response;
        }
        else {
            GetServicesByPackageIdsResponse response = new GetServicesByPackageIdsResponse();
            response.setData(new ArrayList<ServicesByPackageIdDataDTO>());
            return response;
        }
    }
}
