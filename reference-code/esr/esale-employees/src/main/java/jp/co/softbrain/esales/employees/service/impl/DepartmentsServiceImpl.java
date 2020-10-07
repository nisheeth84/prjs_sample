package jp.co.softbrain.esales.employees.service.impl;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.google.gson.Gson;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.domain.Departments;
import jp.co.softbrain.esales.employees.repository.DepartmentsRepository;
import jp.co.softbrain.esales.employees.repository.DepartmentsRepositoryCustom;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.DepartmentsService;
import jp.co.softbrain.esales.employees.service.EmployeesCommonService;
import jp.co.softbrain.esales.employees.service.EmployeesGroupParticipantsService;
import jp.co.softbrain.esales.employees.service.EmployeesGroupsService;
import jp.co.softbrain.esales.employees.service.EmployeesService;
import jp.co.softbrain.esales.employees.service.dto.DepartmentAndEmployeeDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentManagerDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentParentDTO;
import jp.co.softbrain.esales.employees.service.dto.DepartmentsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesWithEmployeeDataFormatDTO;
import jp.co.softbrain.esales.employees.service.dto.GetDepartmentByNameDTO;
import jp.co.softbrain.esales.employees.service.dto.GetDepartmentsOfEmployeeQueryResult;
import jp.co.softbrain.esales.employees.service.dto.GetDepartmentsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.GetDepartmentsOutSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.GetGroupByNameDTO;
import jp.co.softbrain.esales.employees.service.dto.InitializeDepartmentModalOutDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.ValidateResponse;
import jp.co.softbrain.esales.employees.service.mapper.DepartmentsMapper;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetDepartmentsOfEmployeeDepartment;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetGroupAndDepartmentByNameResponse;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.commons.ValidateRequest;
import lombok.NonNull;

/**
 * Service Implementation for managing {@link Departments}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class DepartmentsServiceImpl implements DepartmentsService {

    private static final String NOT_PERMISSION_MSG = "User have not permission";
    private static final String ITEM_VALUE_INVALID = "Item's value invalid";

    private static final String USER_ID_CAPTION = "userId";

    private static final String DEPARTMENT_EXCLUSIVE = "Department exclusive";
    private static final String DEPARTMENT_IDS = "departmentIds";
    private static final String DEPARTMENT_ORDER_FIELD = "departmentOrder";
    private static final String PARENT_ID_FIELD = "parentId";

    private static final String SEARCH_LIKE = "1";
    private static final String SEARCH_LIKE_FIRST = "2";
    private static final String OR_CONDITION = "1";
    private static final String AND_CONDITION = "2";
    private static final String ALL_WORD = "3";

    private final DepartmentsRepository departmentsRepository;

    private final DepartmentsMapper departmentsMapper;

    @Autowired
    private DepartmentsRepositoryCustom departmentsRepositoryCustom;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private EmployeesGroupParticipantsService employeesGroupParticipantsService;

    Gson gson = new Gson();

    @Autowired
    private EmployeesCommonService employeesCommonService;

    @Autowired
    private EmployeesService employeesService;
    @Autowired
    private EmployeesGroupsService employeesGroupsService;

    public DepartmentsServiceImpl(DepartmentsRepository departmentsRepository, DepartmentsMapper departmentsMapper) {
        this.departmentsRepository = departmentsRepository;
        this.departmentsMapper = departmentsMapper;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.DepartmentsService#save(jp.co.softbrain.esales.employees.service.dto.DepartmentsDTO)
     */
    @Override
    public DepartmentsDTO save(DepartmentsDTO departmentsDTO) {
        Departments departments = departmentsMapper.toEntity(departmentsDTO);
        departments = departmentsRepository.save(departments);
        return departmentsMapper.toDto(departments);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.DepartmentsService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<DepartmentsDTO> findAll(Pageable pageable) {
        return departmentsRepository.findAll(pageable).map(departmentsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.DepartmentsService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<DepartmentsDTO> findOne(Long id) {
        Departments departments = departmentsRepository.findByDepartmentId(id);
        if (departments != null) {
            return Optional.of(departments).map(departmentsMapper::toDto);
        }
        return Optional.empty();
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.DepartmentsService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        departmentsRepository.deleteById(id);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.DepartmentsService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<DepartmentsDTO> findAll() {
        return departmentsRepository.findAll().stream().map(departmentsMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.DepartmentsService#initializeDepartmentModal(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public InitializeDepartmentModalOutDTO initializeDepartmentModal(Long departmentId) {
        InitializeDepartmentModalOutDTO response = new InitializeDepartmentModalOutDTO();

        // 1. Validate parameter common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsEmployees.PARAM_DEPARTMENT_ID, departmentId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);

        String token = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        ValidateResponse responseValidate = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (responseValidate.getErrors() != null && !responseValidate.getErrors().isEmpty()) {
            throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, responseValidate.getErrors());
        }
        // 2. Check User permissions
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException("User does not permission.",
                    CommonUtils.putError(ConstantsEmployees.DEPARTMENT_CAPTION, Constants.USER_NOT_PERMISSION));
        }

        // 3. Get departments information Department
        List<DepartmentsDTO> departmentList = employeesCommonService.getDepartments();
        departmentList.forEach(dep -> dep.setManager(employeesCommonService.getDepartment(dep.getDepartmentId())));
        if (departmentId != null) {
            Optional<DepartmentsDTO> department = departmentList.stream().filter(departmentDto -> departmentDto
                    .getDepartmentId().compareTo(departmentId) == ConstantsEmployees.NUMBER_ZERO).findFirst();
            department.ifPresent(dep -> {
                if (dep.getManager() == null) {
                    dep.setManager(new DepartmentManagerDTO());
                }
            });
            if (!department.isEmpty()) {
                response.setDepartment(department.get());
            }
        }

        // Departments
        List<DepartmentsDTO> departmentTree = buildDepartmentTree(departmentList);
        response.setDepartments(departmentTree);

        // 4. return response
        return response;
    }

    /**
     * Build department tree from flat list
     *
     * @param departmentList
     *            the departments list
     * @return the list of DepartmentsDTO
     */
    private List<DepartmentsDTO> buildDepartmentTree(List<DepartmentsDTO> departmentList) {

        if (departmentList == null || departmentList.isEmpty()) {
            return departmentList;
        }
        Map<Long, DepartmentsDTO> departmentMap = new HashMap<>();
        for (DepartmentsDTO dto : departmentList) {
            departmentMap.put(dto.getDepartmentId(), dto);
        }
        List<DepartmentsDTO> departmentTree = new ArrayList<>();
        for (DepartmentsDTO dto : departmentList) {
            if (dto.getParentId() != null) {
                DepartmentsDTO pDto = departmentMap.get(dto.getParentId());
                if (pDto != null) {
                    List<DepartmentsDTO> childList = pDto.getDepartmentChild();
                    if (childList == null) {
                        childList = new ArrayList<>();
                    }
                    childList.add(dto);
                    pDto.setDepartmentChild(childList);
                } else {
                    departmentTree.add(dto);
                }
            } else {
                departmentTree.add(dto);
            }
        }
        return departmentTree;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.DepartmentsService#createDepartment(java.lang.String,
     *      java.lang.Long, java.lang.Long)
     */
    @Override
    @Transactional
    public Long createDepartment(String departmentName, Long managerId, Long parentId) {

        // Get employeeId from Token
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // 1. Validate parameter
        validateCreateDepartment(departmentName, managerId, parentId);

        // 2. Check User permissions
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException("User does not have permission.",
                    CommonUtils.putError(ConstantsEmployees.DEPARTMENT_CAPTION, Constants.USER_NOT_PERMISSION));
        }

        // 3. Check duplicate department
        boolean isExistDepartment = employeesCommonService.isExistDepartment(null, departmentName, parentId);
        if (isExistDepartment) {
            throw new CustomRestException("Duplicate department",
                    CommonUtils.putError(ConstantsEmployees.DEPARTMENT_CAPTION, ConstantsEmployees.EXISTS_DEPARTMENT));
        }

        if (parentId != null && parentId > ConstantsEmployees.NUMBER_ZERO) {
            // 4. Check the structure stratification limit of parts
            List<DepartmentsDTO> listDepartments = employeesCommonService.getDepartments();
            if (!this.isCheckStructureDepartment(listDepartments, parentId)) {
                throw new CustomRestException("the number of floors exceeds allowed", CommonUtils.putError(
                        ConstantsEmployees.DEPARTMENT_CAPTION, ConstantsEmployees.GREATER_NUMBER_OF_FLOORS_ALLOWED));
            }

        }

        // 5. insert a record departments
        return this.insertDepartments(departmentName, managerId, parentId, employeeId);
    }

    /**
     * get max departmentOrder
     *
     * @return max departmentOrder
     */
    private int getMaxDepartmentOrder() {
        Optional<Departments> department = departmentsRepository
                .findFirstByDepartmentOrderNotNullOrderByDepartmentOrderDesc();
        if (!department.isEmpty()) {
            return department.get().getDepartmentOrder() + 1;
        } else {
            return 1;
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.DepartmentsService#updateDepartment(java.lang.Long,
     *      java.lang.String, java.lang.Long, java.lang.Long, java.time.Instant)
     */
    @Override
    @Transactional
    public Long updateDepartment(Long departmentId, String departmentName, Long managerId, Long parentId,
            Instant updatedDate) {
        // 1. Validate parameters
        validateUpdateDepartment(departmentId, departmentName, managerId, parentId);

        // 2. Validate update
        // 2.2 Check User permissions
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException("User does not have permission.",
                    CommonUtils.putError(ConstantsEmployees.DEPARTMENT_CAPTION, Constants.USER_NOT_PERMISSION));
        }
        // 2.3. Check duplicate department
        boolean isDuplicate = employeesCommonService.isExistDepartment(departmentId, departmentName, parentId);
        if (isDuplicate) {
            throw new CustomRestException("Duplicate department",
                    CommonUtils.putError(ConstantsEmployees.DEPARTMENT_CAPTION, ConstantsEmployees.EXISTS_DEPARTMENT));
        }
        // 2.4. Check the structure stratification limit of parts
        if (parentId != null && parentId > ConstantsEmployees.NUMBER_ZERO) {
            List<DepartmentsDTO> listDepartments = employeesCommonService.getDepartments();
            if (!this.isCheckStructureDepartment(listDepartments, parentId)) {
                throw new CustomRestException("The number of floors exceeds allowed", CommonUtils.putError(
                        ConstantsEmployees.DEPARTMENT_CAPTION, ConstantsEmployees.GREATER_NUMBER_OF_FLOORS_ALLOWED));
            }
        }
        // 3. Update department
        this.findOne(departmentId)
                .ifPresentOrElse(dep -> {
                    String departmentNameOld = "";
                    departmentNameOld = dep.getDepartmentName();
                    dep.setDepartmentName(departmentName);
                    dep.setParentId(parentId);
                    dep.setManagerId(managerId);
                    dep.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
                    this.save(dep);

                    // 4. request create data for ElasticSearch
                    if (!checkSameName(departmentNameOld, departmentName)) {
                        List<Long> departmentIds = new ArrayList<>();
                        departmentIds.add(departmentId);
                        if (Boolean.FALSE.equals(employeesCommonService.requestChangeDataElasticSearch(null, departmentIds, null,
                                Constants.ChangeAction.UPDATE.getValue()))) {
                            throw new CustomRestException("Insert data change failed",
                                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
                        }
                    }

                }, () -> {
                    throw new CustomRestException(DEPARTMENT_EXCLUSIVE,
                            CommonUtils.putError(ConstantsEmployees.DEPARTMENT_CAPTION, Constants.EXCLUSIVE_CODE));
                });

        return departmentId;
    }

    /**
     * Check change name
     *
     * @param nameOld
     *            name before update
     * @param nameParam
     *            name after update
     * @return true if same , false if not same
     */
    private boolean checkSameName(String nameOld, String nameParam) {
        boolean result = false;
        if ((nameOld == null && nameParam == null) || (nameOld != null && nameOld.equals(nameParam))) {
            result = true;
        }
        return result;
    }

    /**
     * Validate parameter createDepartment
     *
     * @param departmentName
     *            the departmentName of entity
     * @param managerId
     *            the managerId of entity
     * @param parentId
     *            the parentId of entity
     */
    private void validateCreateDepartment(String departmentName, Long managerId, Long parentId) {

        // validate internal
        if (StringUtils.isEmpty(departmentName)) {
            throw new CustomRestException("Param [departmentName] is null.",
                    CommonUtils.putError(ConstantsEmployees.DEPARTMENT_NAME, Constants.RIQUIRED_CODE));
        }

        // validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsEmployees.DEPARTMENT_NAME, departmentName);
        fixedParams.put(ConstantsEmployees.PARAM_MANAGER_ID, managerId);
        fixedParams.put(PARENT_ID_FIELD, parentId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);

        String token = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, response.getErrors());
        }
    }

    /**
     * Check the structure stratification limit of parts
     *
     * @param departmentList
     *            the departments list
     * @param parentId
     *            the parentId of entity
     * @return true The number of stratified parts is less than 20 false otherwise
     */
    private boolean isCheckStructureDepartment(List<DepartmentsDTO> departmentList, Long parentId) {
        int count = -1;
        Map<Long, Long> departmentParentMap = new HashMap<>();
        departmentList
                .forEach(department -> departmentParentMap.put(department.getDepartmentId(), department.getParentId()));
        while (parentId != null) {
            count++;
            if (count == ConstantsEmployees.NUMBER_OF_FLOORS_ALLOWED) {
                break;
            }
            parentId = departmentParentMap.get(parentId);
        }
        return count < ConstantsEmployees.NUMBER_OF_FLOORS_ALLOWED;
    }

    /**
     * insert a record departments
     *
     * @param departmentName
     *            the departmentName of entity
     * @param managerId
     *            the managerId of entity
     * @param parentId
     *            the parentId of entity
     * @param employeeId
     *            the employeeId of entity
     * @return the departmentId of entity inserted
     */
    private Long insertDepartments(String departmentName, Long managerId, Long parentId, Long employeeId) {
        DepartmentsDTO department = new DepartmentsDTO();

        department.setDepartmentName(departmentName);
        department.setDepartmentOrder(getMaxDepartmentOrder());
        department.setParentId(parentId);
        department.setManagerId(managerId);
        department.setCreatedUser(employeeId);
        department.setUpdatedUser(employeeId);
        DepartmentsDTO departmentResult = this.save(department);

        return departmentResult.getDepartmentId();

    }

    /**
     * Validate parameters for API updateDepartment
     *
     * @param departmentId
     *            - id to update
     * @param departmentName
     *            - Name to update
     * @param managerId
     *            - managerId to update
     * @param parentId
     *            - department's parent ID
     */
    private void validateUpdateDepartment(Long departmentId, String departmentName, Long managerId, Long parentId) {
        if (departmentId == null) {
            throw new CustomRestException("Pram departmentId's value is invalid",
                    CommonUtils.putError(ConstantsEmployees.PARAM_DEPARTMENT_ID, Constants.RIQUIRED_CODE));
        }
        if (StringUtils.isBlank(departmentName)) {
            throw new CustomRestException("Param departmentName's value is invalid",
                    CommonUtils.putError(ConstantsEmployees.PARAM_DEPARTMENT_NAME, Constants.RIQUIRED_CODE));
        }

        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();

        fixedParams.put(ConstantsEmployees.PARAM_DEPARTMENT_ID, departmentId);
        fixedParams.put(ConstantsEmployees.DEPARTMENT_NAME, departmentName);
        fixedParams.put(ConstantsEmployees.PARAM_MANAGER_ID, managerId);
        fixedParams.put(PARENT_ID_FIELD, parentId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);

        String token = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS, "validate",
                HttpMethod.POST, validateRequest, ValidateResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, response.getErrors());
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.DepartmentsService#changeDepartmentOrder(java.util.List)
     */
    @Override
    public List<Long> changeDepartmentOrder(List<DepartmentsDTO> departmentParams) {
        // inner validate
        if (departmentParams == null || departmentParams.isEmpty()) {
            throw new CustomRestException(ITEM_VALUE_INVALID,
                    CommonUtils.putError("departmentParams", Constants.RIQUIRED_CODE));
        }
        // validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        departmentParams.stream().forEach(department -> fixedParams.putAll(jsonBuilder.convertObjectIncludeFields(
                department,
                Arrays.asList(ConstantsEmployees.PARAM_DEPARTMENT_ID, DEPARTMENT_ORDER_FIELD, PARENT_ID_FIELD))));
        String validateJson = jsonBuilder.build(FieldBelong.EMPLOYEE.getValue(), fixedParams,
                (Map<String, Object>) null);

        String token = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS, "validate",
                HttpMethod.POST, validateRequest, ValidateResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, response.getErrors());
        }
        // update data
        List<Long> listUpdated = new ArrayList<>();
        departmentParams.stream().forEach(department -> {
            this.findOne(department.getDepartmentId())
                    .ifPresentOrElse(dep -> {
                        dep.setParentId(department.getParentId());
                        dep.setDepartmentOrder(department.getDepartmentOrder());
                        dep.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
                        this.save(dep);
                    }, () -> {
                        throw new CustomRestException(DEPARTMENT_EXCLUSIVE,
                                CommonUtils.putError(ConstantsEmployees.DEPARTMENT_CAPTION, Constants.EXCLUSIVE_CODE));
                    });
            listUpdated.add(department.getDepartmentId());
        });
        return listUpdated;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.DepartmentsService#deleteDepartment(java.lang.Long)
     */
    @Override
    @Transactional
    public Long deleteDepartment(Long departmentId) {
        // Check user's authority
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException(NOT_PERMISSION_MSG,
                    CommonUtils.putError(USER_ID_CAPTION, Constants.USER_NOT_PERMISSION));
        }

        // Check the existing user in the department
        if (employeesCommonService.countEmployees(departmentId) > 0) {
            throw new CustomRestException("Some employee is existed in department so could not delete!", CommonUtils
                    .putError(ConstantsEmployees.DEPARTMENT_CAPTION, ConstantsEmployees.CANNOT_DELETE_DEPARTMENT));
        }

        DepartmentsDTO dep = this.findOne(departmentId).orElse(null);
        if (dep == null) {
            throw new CustomRestException("This department did not exist anymore!",
                    CommonUtils.putError(ConstantsEmployees.DEPARTMENT_CAPTION, Constants.EXCLUSIVE_CODE));
        }
        // Delete record employees group participants by departmentId.
        employeesGroupParticipantsService.deleteByDepartmentId(departmentId);

        // update department childs
        List<Departments> listChild = departmentsRepository.findByParentId(departmentId);
        if (!CollectionUtils.isEmpty(listChild)) {
            departmentsRepository.saveAll(listChild.stream().map(depChild -> {
                depChild.setParentId(null);
                depChild.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
                return depChild;
            }).collect(Collectors.toList()));
        }
        // Delete Departments
        departmentsRepository.deleteByDepartmentId(departmentId);
        return departmentId;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.DepartmentsService#getDepartments(java.util.List,
     *      java.lang.Long, boolean, java.lang.String)
     */
    @Override
    public GetDepartmentsOutDTO getDepartments(List<Long> departmentIds, Long employeeId, boolean getEmployeesFlg,
            String languageKey) {
        // 1. Validate parameter
        if (departmentIds == null) {
            throw new CustomRestException("Param [departmentIds] is null.",
                    CommonUtils.putError(DEPARTMENT_IDS, Constants.RIQUIRED_CODE));
        }

        if (employeeId != null && employeeId <= 0) {
            throw new CustomRestException("Param [employeeId] is not Nagative.",
                    CommonUtils.putError(ConstantsEmployees.PARAM_EMPLOYEE_ID, Constants.NUMBER_NOT_NEGATIVE));
        }

        // 2. Get list department and employeeIds
        List<DepartmentAndEmployeeDTO> departmentAndEmployeeIdsList = departmentsRepositoryCustom
                .getDepartmentAndEmployeeIds(departmentIds, employeeId, getEmployeesFlg);

        // 3. Get employee list
        // 3.1 Get employeeIds
        List<Long> employeeIdList = new ArrayList<>();
        departmentAndEmployeeIdsList.stream()
                .filter(departmentEmployee -> getEmployeesFlg && departmentEmployee.getEmployeeId() != null
                        && !employeeIdList.contains(departmentEmployee.getEmployeeId()))
                .forEach(departmentEmployee -> employeeIdList.add(departmentEmployee.getEmployeeId()));

        // 3.2 Get information employee
        List<EmployeesWithEmployeeDataFormatDTO> listEmployees = employeesService.toEmployeesWithEmployeeDataFormat(
                employeesCommonService.getEmployees(employeeIdList, null, languageKey), true);

        // 4. Make data response
        // Build department
        List<GetDepartmentsOutSubType1DTO> departments = new ArrayList<>();
        List<Long> departmentIdList = new ArrayList<>();
        for (DepartmentAndEmployeeDTO departmentEmployee : departmentAndEmployeeIdsList) {
            Long departmentId = departmentEmployee.getDepartmentId();
            if (departmentIdList.contains(departmentId)) {
                continue;
            }
            List<Long> employeeIds = new ArrayList<>();
            departmentAndEmployeeIdsList.stream()
                    .filter(dep -> getEmployeesFlg && dep.getDepartmentId().equals(departmentId)
                            && dep.getEmployeeId() != null && !employeeIds.contains(dep.getEmployeeId()))
                    .forEach(dep -> employeeIds.add(dep.getEmployeeId()));
            DepartmentParentDTO departmentParent = new DepartmentParentDTO();
            departmentParent.setDepartmentId(departmentEmployee.getParentId());
            departmentParent.setDepartmentName(departmentEmployee.getParentName());

            GetDepartmentsOutSubType1DTO subType1DTO = new GetDepartmentsOutSubType1DTO();
            subType1DTO.setDepartmentId(departmentId);
            subType1DTO.setDepartmentName(departmentEmployee.getDepartmentName());
            subType1DTO.setParentDepartment(departmentParent);
            subType1DTO.setEmployeeIds(employeeIds);
            subType1DTO.setUpdatedDate(departmentEmployee.getUpdatedDate());
            departments.add(subType1DTO);
            departmentIdList.add(departmentId);
        }

        GetDepartmentsOutDTO outDto = new GetDepartmentsOutDTO();
        outDto.setDepartments(departments);
        outDto.setEmployees(listEmployees);
        return outDto;
    }

    /**
     * @see DepartmentsService#getDepartmentsOfEmployee(Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<GetDepartmentsOfEmployeeDepartment> getDepartmentsOfEmployee(@NonNull Long employeeId) {
        List<GetDepartmentsOfEmployeeQueryResult> departmentsOfEmployeeQueryResults = departmentsRepositoryCustom.getDepartmentsOfEmployee(employeeId);
        Map<Long, String> departmentNameMap = new HashMap<>();
        departmentsOfEmployeeQueryResults.forEach(departmentResult -> {
            if (departmentNameMap.containsKey(departmentResult.getDepartmentId())) {
                departmentNameMap.put(departmentResult.getDepartmentId(), departmentResult.getDepartmentName());
            }
        });
        Map<Long, List<GetDepartmentsOfEmployeeQueryResult>> departmentsOfEmployeeQueryResultMap = departmentsOfEmployeeQueryResults
                .stream().collect(Collectors.groupingBy(GetDepartmentsOfEmployeeQueryResult::getCurrentId));

        List<GetDepartmentsOfEmployeeDepartment> result = new ArrayList<>();
        departmentsOfEmployeeQueryResultMap.keySet()
                .forEach(currentId -> departmentsOfEmployeeQueryResultMap.get(currentId).forEach(departmentResult -> {
                    if (departmentResult.getCurrentId().longValue() == departmentResult.getDepartmentId().longValue()) {
                        result.add(GetDepartmentsOfEmployeeDepartment.builder()
                                .departmentId(departmentResult.getDepartmentId())
                                .departmentName(departmentResult.getDepartmentName()).build());
                    } else {
                        addDepartmentToLeafItem(
                                result.stream()
                                        .filter(employeeDepartment -> employeeDepartment.getDepartmentId()
                                                .longValue() == currentId.longValue())
                                        .collect(Collectors.toList()),
                                GetDepartmentsOfEmployeeDepartment.builder()
                                        .departmentId(departmentResult.getDepartmentId())
                                        .departmentName(departmentResult.getDepartmentName())
                                        .parentId(departmentResult.getParentId()).build());
                    }
                }));
        return result;
    }

    private void addDepartmentToLeafItem(List<GetDepartmentsOfEmployeeDepartment> list, GetDepartmentsOfEmployeeDepartment employeeDepartment) {
        List<GetDepartmentsOfEmployeeDepartment> subList = list.stream()
                .filter(employeeDepartment1 ->
                        employeeDepartment1.getDepartmentId().longValue() == employeeDepartment.getParentId().longValue())
                .collect(Collectors.toList());
        if (!subList.isEmpty()) {
            subList.forEach(employeeDepartment1 -> employeeDepartment1.getChildDepartments().add(employeeDepartment));
        } else {
            list.forEach(employeeDepartment1 -> addDepartmentToLeafItem(employeeDepartment1.getChildDepartments(), employeeDepartment));
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.DepartmentsService#getGroupAndDepartmentByName(java.lang.String,
     *      java.lang.Integer, java.lang.Integer)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetGroupAndDepartmentByNameResponse getGroupAndDepartmentByName(String searchValue, Integer searchType,
            Integer searchOption) {
        // 1. Validate parameter
        if (searchValue == null) {
            throw new CustomRestException("Param [searchValue] is null.",
                    CommonUtils.putError(ConstantsEmployees.SEARCH_VALUE, Constants.RIQUIRED_CODE));
        }
        if (searchType == null) {
            throw new CustomRestException("Param [searchType] is null.",
                    CommonUtils.putError(ConstantsEmployees.SEARCH_TYPE, Constants.RIQUIRED_CODE));
        }
        if (searchOption == null) {
            throw new CustomRestException("Param [searchOption] is null.",
                    CommonUtils.putError(ConstantsEmployees.SEARCH_OPTION, Constants.RIQUIRED_CODE));
        }
        // 2.1 Get id department
        Map<String, Object> depParameters = new HashMap<>();
        String conditionsDep = queryBuilderForSearchValue(searchValue, ConstantsEmployees.COLUMN_DEPARTMENT_NAME,
                String.valueOf(searchType), String.valueOf(searchOption), depParameters);
        List<GetDepartmentByNameDTO> departments = departmentsRepositoryCustom.getDepartmentByConditions(conditionsDep, depParameters);
        // 2.2 Get id group
        Map<String, Object> grpParameters = new HashMap<>();
        String conditionsGroup = queryBuilderForSearchValue(searchValue, ConstantsEmployees.COLUMN_GROUP_NAME,
                String.valueOf(searchType), String.valueOf(searchOption), grpParameters);
        List<GetGroupByNameDTO> groups = employeesGroupsService.getGroupByConditions(conditionsGroup, grpParameters);
        GetGroupAndDepartmentByNameResponse response = new GetGroupAndDepartmentByNameResponse();
        response.setDepartments(departments);
        response.setGroups(groups);
        return response;
    }

    /**
     * build condition query for search LIKE
     *
     * @param fieldValue
     *            value search
     * @param fieldName
     *            field search
     * @param searchType
     *            1: %a%; 2: a%
     * @param searchOption
     *            1: OR; 2: AND; 3: ALL
     * @return condition to search
     */
    private String queryBuilderForSearchValue(
            String fieldValue,
            String fieldName, String searchType, String searchOption, Map<String, Object> parameters) {
        searchType = searchType == null ? SEARCH_LIKE : searchType;
        searchOption = searchOption == null ? OR_CONDITION : searchOption;

        if (Constants.EMPTY.equals(fieldValue)) {
            return getConditionQuerySearchEmpty(fieldName);
        }
        // search keyword
        String[] words = fieldValue.split(ConstantsEmployees.SPACE);
        StringBuilder queryBuilder = new StringBuilder();
        switch (searchType) {
        case SEARCH_LIKE_FIRST:
            switch (searchOption) {
            case ALL_WORD:
                buildLikeConditions(queryBuilder, fieldName, new String[] { fieldValue },
                        Constants.Query.AND_CONDITION, parameters, false);
                break;
            case AND_CONDITION:
                buildLikeConditions(queryBuilder, fieldName, words, Constants.Query.AND_CONDITION, parameters, false);
                break;
            case OR_CONDITION:
            default:
                buildLikeConditions(queryBuilder, fieldName, words, Constants.Query.OR_CONDITION, parameters, false);
                break;
            }
            break;
        case SEARCH_LIKE:
        default:
            switch (searchOption) {
            case ALL_WORD:
                buildLikeConditions(queryBuilder, fieldName, new String[] { fieldValue },
                        Constants.Query.AND_CONDITION, parameters, true);
                break;
            case AND_CONDITION:
                buildLikeConditions(queryBuilder, fieldName, words, Constants.Query.AND_CONDITION, parameters, true);
                break;
            case OR_CONDITION:
            default:
                buildLikeConditions(queryBuilder, fieldName, words, Constants.Query.OR_CONDITION, parameters, true);
                break;
            }
            break;
        }
        return queryBuilder.toString();
    }

    /**
     * Get condition qerry to search text has not been entered
     * 
     * @return condition querry
     */
    private String getConditionQuerySearchEmpty(String fieldName) {
        StringBuilder conditionQuerry = new StringBuilder();
        conditionQuerry.append(Constants.Query.SPACE).append(Constants.Query.AND_CONDITION);
        conditionQuerry.append(Constants.Query.SPACE).append(fieldName).append(Constants.Query.IS_NULL);
        conditionQuerry.append(Constants.Query.OR_CONDITION).append(Constants.Query.SPACE).append(fieldName)
                .append(Constants.Query.SPACE).append(Constants.Query.EQUAL_EMPTY);
        return conditionQuerry.toString();
    }

    /*
     * build must query with wildcard data
     *
     * @param query
     * 
     * @param fieldName elasticsearch attribute
     * 
     * @param words list keyword
     * 
     * @param format template format keyword
     * 
     * @param parameters parameter list for sql query
     * 
     * @param isLike true if it is search like query, false if search like first
     * query
     */
    private void buildLikeConditions(StringBuilder queryBuilder, String fieldName, String[] words, String condition,
            Map<String, Object> parameters, Boolean isLike) {
        int index = 0;
        for (String word : words) {
            if (StringUtils.isEmpty(word)) {
                continue;
            }
            String paramName = String.format("param_%d", index++);
            if (queryBuilder.length() > 0) {
                queryBuilder.append(Constants.Query.SPACE).append(condition);
            }
            if (isLike) {
                // like query build
                queryBuilder.append(String.format(" %s LIKE \'%%\' || :%s || \'%%\' ", fieldName, paramName));
            } else {
                // like first query build
                queryBuilder.append(String.format(" %s LIKE :%s || \'%%\' ", fieldName, paramName));
            }
            parameters.put(paramName, StringUtil.escapeSqlCommand(word));
        }
    }
}
