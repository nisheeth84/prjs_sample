package jp.co.softbrain.esales.employees.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.domain.EmployeesDepartments;
import jp.co.softbrain.esales.employees.repository.DepartmentsRepository;
import jp.co.softbrain.esales.employees.repository.EmployeesDepartmentsRepository;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.EmployeesCommonService;
import jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService;
import jp.co.softbrain.esales.employees.service.TmsService;
import jp.co.softbrain.esales.employees.service.dto.CheckDeletePositionsOutDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDepartmentsDTO;
import jp.co.softbrain.esales.employees.service.dto.MoveToDepartmentResponse;
import jp.co.softbrain.esales.employees.service.dto.SetManagersInDTO;
import jp.co.softbrain.esales.employees.service.dto.SetManagersSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.commons.ValidateResponse;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesDepartmentsMapper;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.tms.TransIDHolder;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.StringUtil;
import jp.co.softbrain.esales.utils.dto.commons.ValidateRequest;

/**
 * Service implement for EmployeesDepartmentsService
 *
 * @author lediepoanh
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class EmployeesDepartmentsServiceImpl implements EmployeesDepartmentsService {

    private static final String ITEM_VALUE_INVALID = "Item's value is invalid";
    private static final Integer TYPE_DISPATCH = 1;
    private static final Integer TYPE_CONCURRENTLY = 2;
    private static final int LIMIT_CONCURRENTLY = 3;
    private static final String FIELD_MOVE_TYPE = "moveType";
    private static final String USER_ID_CAPTION = "userId";
    private static final String NOT_HAVE_PERMISSION = "User does not have permission.";
    private static final String INSERT_DATA_CHANGE_FAILED = "Insert data change failed";

    private static final String URL_API_VALIDATE = "validate";

    private final EmployeesDepartmentsRepository employeesDepartmentsRepository;

    private final EmployeesDepartmentsMapper employeesDepartmentsMapper;

    @Autowired
    private EmployeesCommonService employeesCommonService;

    @Autowired
    private TmsService tmsService;

    @Autowired
    private DepartmentsRepository departmentsRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private RestOperationUtils restOperationUtils;

    Gson gson = new Gson();

    /**
     * Contructor
     * 
     * @param employeesDepartmentsRepository
     * @param employeesDepartmentsMapper
     */
    public EmployeesDepartmentsServiceImpl(EmployeesDepartmentsRepository employeesDepartmentsRepository,
            EmployeesDepartmentsMapper employeesDepartmentsMapper) {
        this.employeesDepartmentsRepository = employeesDepartmentsRepository;
        this.employeesDepartmentsMapper = employeesDepartmentsMapper;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService#save(jp.co.softbrain.esales.employees.service.dto.EmployeesDepartmentsDTO)
     */
    @Override
    public EmployeesDepartmentsDTO save(EmployeesDepartmentsDTO employeesDepartmentsDTO) {
        if (StringUtil.isEmpty(TransIDHolder.getTransID())) { // @TMS
            EmployeesDepartments employeesDepartments = employeesDepartmentsMapper.toEntity(employeesDepartmentsDTO);
            return employeesDepartmentsMapper.toDto(employeesDepartmentsRepository.save(employeesDepartments));
        } else {
            return tmsService.saveEmployeeDepartment(employeesDepartmentsDTO, TransIDHolder.getTransID());
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeesDepartmentsDTO> findAll() {
        return employeesDepartmentsRepository.findAll().stream().map(employeesDepartmentsMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<EmployeesDepartmentsDTO> findOne(Long employeesDepartmentsId) {
        EmployeesDepartments employeesDepartments = employeesDepartmentsRepository.findByEmployeesDepartmentsId(employeesDepartmentsId);
        if (employeesDepartments != null) {
            return Optional.of(employeesDepartments).map(employeesDepartmentsMapper::toDto);
        }
        return Optional.empty();
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long employeesDepartmentsId) {
        employeesDepartmentsRepository.deleteById(employeesDepartmentsId);

    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService#deleteByEmployeeId(java.lang.Long)
     */
    @Override
    public void deleteByEmployeeId(Long employeeId) {
        employeesDepartmentsRepository.deleteByEmployeeId(employeeId);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService#findByDepartmentIdAndEmployeeIds(java.lang.Long,
     *      java.util.List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeesDepartmentsDTO> findByDepartmentIdAndEmployeeIds(Long departmentId, List<Long> employeeIds) {
        return employeesDepartmentsRepository.findByDepartmentIdAndEmployeeIds(departmentId, employeeIds).stream()
                .map(employeesDepartmentsMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService#getEmployeeIdByDepartment(java.util.List)
     */
    @Override
    public List<Long> getEmployeeIdByDepartment(List<Long> departmentIds) {
        return employeesDepartmentsRepository.getEmployeeIdByDepartment(departmentIds);
    }

    /**
     * Get one record employeesDepartment
     * 
     * @param employeeId the employeeId of the entity
     * @param departmentId the departmentId of the entity
     * @return the optional entity
     */
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<EmployeesDepartmentsDTO> findOneByEmployeeIdAndDepartmentId(Long employeeId, Long departmentId) {
        List<EmployeesDepartments> employeeDepartmentList = employeesDepartmentsRepository
                .findOneByEmployeeIdAndDepartmentId(employeeId, departmentId);
        return employeesDepartmentsMapper.toDto(employeeDepartmentList);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService#moveToDepartment(java.lang.Long,
     *      java.util.List, java.lang.Integer)
     */
    @Override
    public MoveToDepartmentResponse moveToDepartment(Long departmentId, List<Long> employeeIds, Integer moveType) {
        // 1. validate parameters
        validateMoveToDepartment(departmentId, employeeIds, moveType);

        // 2. check user'authority
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException("User does not have permission",
                    CommonUtils.putError(USER_ID_CAPTION, Constants.USER_NOT_PERMISSION));
        }
        // 3. Check exist destination department
        if (departmentsRepository.checkExistDepartmentById(departmentId) <= 0) {
            throw new CustomRestException("The department has no longer exist!",
                    CommonUtils.putError(ConstantsEmployees.DEPARTMENT_CAPTION, Constants.PARAMETER_INVALID));
        }

        MoveToDepartmentResponse responseAPI = new MoveToDepartmentResponse();

        // 4. Move to department
        List<Long> idsMoveSuccess = new ArrayList<>();
        List<Long> idsMoveError = new ArrayList<>();
        final List<EmployeesDepartments> employeesDepartmentsList = new ArrayList<>();
        employeeIds.stream().forEach(employeeId -> {
            // If move type is dispatch, remove some employees_deparments
            if (TYPE_CONCURRENTLY.equals(moveType)
                    && employeesDepartmentsRepository.countRelationOfEmployee(employeeId) == LIMIT_CONCURRENTLY) {
                idsMoveError.add(employeeId);
                return;
            }
            if (TYPE_DISPATCH.equals(moveType)) {
                employeesDepartmentsRepository.deleteByEmployeeIdAndDepartmentIdNot(employeeId, departmentId);
            }
            // If employee have already in department, skip this employee
            if (Boolean.TRUE.equals(employeesCommonService.isExistDepartmentRelation(employeeId, departmentId))) {
                idsMoveSuccess.add(employeeId);
                return;
            }
            EmployeesDepartmentsDTO employeesDepartmentsDTO = new EmployeesDepartmentsDTO();
            employeesDepartmentsDTO.setEmployeeId(employeeId);
            employeesDepartmentsDTO.setDepartmentId(departmentId);
            employeesDepartmentsDTO.setPositionId(null);
            employeesDepartmentsDTO.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
            employeesDepartmentsDTO.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
            employeesDepartmentsList.add(employeesDepartmentsMapper.toEntity(employeesDepartmentsDTO));
            idsMoveSuccess.add(employeeId);
        });

        if (!idsMoveError.isEmpty()) {
            responseAPI.setIdsMovedSuccess(idsMoveSuccess);
            responseAPI.setIdsMovedError(idsMoveError);
            return responseAPI;
        }
        if (!employeesDepartmentsList.isEmpty()) {
            List<EmployeesDepartments> resultList = employeesDepartmentsRepository.saveAll(employeesDepartmentsList);
            idsMoveSuccess
                    .addAll(resultList.stream().map(EmployeesDepartments::getEmployeeId).collect(Collectors.toList()));
        }

        // 5. request create data for ElasticSearch
        if (Boolean.FALSE.equals(employeesCommonService.requestChangeDataElasticSearch(employeeIds, null, null,
                Constants.ChangeAction.UPDATE.getValue()))) {
            throw new CustomRestException(INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }
        responseAPI.setIdsMovedSuccess(idsMoveSuccess);
        responseAPI.setIdsMovedError(idsMoveError);
        return responseAPI;
    }

    /**
     * Validate parameters for API moveToDepartment
     * 
     * @param departmentId - destination department
     * @param employeeIds - list employeeId will be moved
     * @param moveType - type dispatch or type concurrently
     */
    private void validateMoveToDepartment(Long departmentId, List<Long> employeeIds, Integer moveType) {
        // validate require parameters
        if (departmentId == null) {
            throw new CustomRestException(ITEM_VALUE_INVALID,
                    CommonUtils.putError(ConstantsEmployees.PARAM_DEPARTMENT_ID, Constants.RIQUIRED_CODE));
        }
        if (employeeIds == null || employeeIds.isEmpty()) {
            throw new CustomRestException(ITEM_VALUE_INVALID,
                    CommonUtils.putError(ConstantsEmployees.PARAM_EMPLOYEE_IDS, Constants.RIQUIRED_CODE));
        }
        if (moveType == null) {
            throw new CustomRestException(ITEM_VALUE_INVALID,
                    CommonUtils.putError(FIELD_MOVE_TYPE, Constants.RIQUIRED_CODE));
        }

        // validate commons
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsEmployees.PARAM_DEPARTMENT_ID, departmentId);
        fixedParams.put(FIELD_MOVE_TYPE, moveType);
        IntStream.range(0, employeeIds.size()).forEach(
                index -> fixedParams.put(ConstantsEmployees.PARAM_EMPLOYEE_ID + index, employeeIds.get(index)));

        String token = SecurityUtils.getTokenValue().orElse(null);
        String validateJson = jsonBuilder.build(FieldBelong.EMPLOYEE.getValue(), fixedParams,
                (Map<String, Object>) null);
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        ValidateResponse responseValidate = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (responseValidate.getErrors() != null && !responseValidate.getErrors().isEmpty()) {
            throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, responseValidate.getErrors());
        }
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService#setManagers(java.util.List)
     */
    @Override
    @Transactional
    public List<Long> setManagers(List<SetManagersInDTO> settingParams) {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        List<Long> lsEmployeesDepartmentsIdUpdated = new ArrayList<>();

        // 1. validate parameters
        validateSetManagers(settingParams);

        // 2. Check authority"
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException("User does not have edit permission",CommonUtils.putError(
                    ConstantsEmployees.EMPLOYEES_DEPARTMENTS_CAPTION, Constants.USER_NOT_PERMISSION));
        }

        List<Long> employeeIds = new ArrayList<>();
        // 3. Setting up manager
        for (SetManagersInDTO setManagersInDTO : settingParams) {
            lsEmployeesDepartmentsIdUpdated.addAll(this.updateListEmployeesDepartment(setManagersInDTO, employeeId));
            if (setManagersInDTO.getEmployeeUpdates() != null) {
                setManagersInDTO.getEmployeeUpdates()
                        .forEach(managerDto -> employeeIds.add(managerDto.getEmployeeId()));
            }
        }

        // 4. request create data for ElasticSearch
        if (Boolean.FALSE.equals(employeesCommonService.requestChangeDataElasticSearch(employeeIds, null, null,
                Constants.ChangeAction.UPDATE.getValue()))) {
            throw new CustomRestException(INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }

        return lsEmployeesDepartmentsIdUpdated;
    }

    /**
     * update list employeesDepartments
     * 
     * @param setManagersInDTO - Manager setting information
     * @param employeeId - user login
     * @return list employeesDepartmentId updated
     */
    private List<Long> updateListEmployeesDepartment(SetManagersInDTO setManagersInDTO, Long employeeId) {
        List<Long> listUpdateId = new ArrayList<>();
        for (SetManagersSubType1DTO item : setManagersInDTO.getEmployeeUpdates()) {
            // Get many record employeesDepartments for check exclusive
            List<EmployeesDepartmentsDTO> empDepartmentDTOList = this
                    .findOneByEmployeeIdAndDepartmentId(item.getEmployeeId(), setManagersInDTO.getDepartmentId());
            Optional.ofNullable(empDepartmentDTOList).map(Collection::stream).orElse(Stream
                    .empty()).forEach(empDepDTO -> {
                        empDepDTO.setUpdatedUser(employeeId);
                        empDepDTO.setManagerId(setManagersInDTO.getManagerId());
                        this.save(empDepDTO);
                        listUpdateId.add(empDepDTO.getEmployeesDepartmentsId());
                    });
        }
        return listUpdateId;
    }

    /**
     * validate Set Managers
     *
     * @param settingParams - Manager setting information array
     */
    private void validateSetManagers(List<SetManagersInDTO> settingParams) {
        List<Map<String, Object>> errors = new ArrayList<>();
        int index = 0;
        // 1.1 validate internal
        if (settingParams == null || settingParams.isEmpty()) {
            errors.add(CommonUtils.putError("settingParams", Constants.RIQUIRED_CODE));
        } else {
            errors.addAll(validateSettingParams(index, settingParams));
        }
        // 1.2 Validate common
        errors.addAll(validateCommonParameter(settingParams));
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, errors);
        }
    }

    /**
     * validate settingParams
     * 
     * @param index index
     * @param settingParams the entity list of SetManagersInDTO
     * @return errors list
     */
    private List<Map<String, Object>> validateSettingParams(int index, List<SetManagersInDTO> settingParams) {
        List<Map<String, Object>> errors = new ArrayList<>();
        for (SetManagersInDTO setManagersInDTO : settingParams) {
            if (setManagersInDTO.getDepartmentId() == null) {
                errors.add(
                        CommonUtils.putError(ConstantsEmployees.PARAM_DEPARTMENT_ID, Constants.RIQUIRED_CODE, index));
            }
            if (setManagersInDTO.getManagerId() == null) {
                errors.add(CommonUtils.putError(ConstantsEmployees.PARAM_MANAGER_ID, Constants.RIQUIRED_CODE, index));
            }
            if (setManagersInDTO.getEmployeeUpdates() == null || setManagersInDTO.getEmployeeUpdates().isEmpty()) {
                errors.add(CommonUtils.putError("employeeUpdates", Constants.RIQUIRED_CODE, index));
            }
            index++;
        }
        return errors;
    }

    /**
     * validate common parameter
     * 
     * @param settingParams - Manager setting information array
     * @return list error
     */
    private List<Map<String, Object>> validateCommonParameter(List<SetManagersInDTO> settingParams) {
        List<Map<String, Object>> errorValidateCommon = new ArrayList<>();
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put("settingParams", settingParams);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        // json for validate common and call method validate common
        String token = SecurityUtils.getTokenValue().orElse(null);
                ValidateRequest validateRequest = new ValidateRequest(validateJson);
        ValidateResponse responseValidate = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (responseValidate.getErrors() != null && !responseValidate.getErrors().isEmpty()) {
            throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, responseValidate.getErrors());
        }
        return errorValidateCommon;
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesDepartmentsService#removeManager(java.util.List)
     */
    @Override
    public List<Long> removeManager(List<Long> employeeIds) {
        // 1. Check user permission
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException(NOT_HAVE_PERMISSION,
                    CommonUtils.putError(ConstantsEmployees.PARAM_EMPLOYEE_ID, Constants.USER_NOT_PERMISSION));
        }
        // 2. Validate parameter
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        for (int i = 0; i < employeeIds.size(); i++) {
            fixedParams.put(ConstantsEmployees.PARAM_EMPLOYEE_ID + i, employeeIds.get(i));
        }
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);

        String token = SecurityUtils.getTokenValue().orElse(null);
                ValidateRequest validateRequest = new ValidateRequest(validateJson);
        ValidateResponse responseValidate = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (responseValidate.getErrors() != null && !responseValidate.getErrors().isEmpty()) {
            throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, responseValidate.getErrors());
        }

        // Remove manager
        Long employeeIdLogin = jwtTokenUtil.getEmployeeIdFromToken();
        List<EmployeesDepartments> employeesDepartmentsList = new ArrayList<>();
        employeeIds.forEach(employeeId -> employeesDepartmentsRepository.findByEmployeeId(employeeId)
                .forEach(employeesDepartments -> {
                    employeesDepartments.setManagerId(null);
                    employeesDepartments.setUpdatedUser(employeeIdLogin);
                    employeesDepartmentsList.add(employeesDepartments);
                }));
        if (!employeesDepartmentsList.isEmpty()) {
            employeesDepartmentsRepository.saveAll(employeesDepartmentsList);
        }

        // 4. request create data for ElasticSearch
        if (Boolean.FALSE.equals(employeesCommonService.requestChangeDataElasticSearch(employeeIds, null, null,
                Constants.ChangeAction.UPDATE.getValue()))) {
            throw new CustomRestException(INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }

        return employeeIds;
    }

    /*
     * @see jp.co.softbrain.esales.employees.service
     * EmployeesDepartmentsService#checkDeletePositions(List<Long>)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public CheckDeletePositionsOutDTO getCheckDeletePositions(List<Long> positionIds) {
        // 1. Validate parameter
        CheckDeletePositionsOutDTO response = new CheckDeletePositionsOutDTO();
        if (positionIds == null || positionIds.isEmpty()) {
            throw new CustomRestException("Param [positionIds] is null.",
                    CommonUtils.putError(ConstantsEmployees.POSITION_IDS, Constants.RIQUIRED_CODE));
        }
        // 2. Get list position using
        List<EmployeesDepartments> lstPosition = employeesDepartmentsRepository.findByPositionIdIn(positionIds);
        List<Long> lstPositionId = lstPosition.stream().map(EmployeesDepartments::getPositionId)
                .collect(Collectors.toList());

        // 3. Create data response
        response.setPositionIds(lstPositionId.stream().distinct().collect(Collectors.toList()));
        return response;
    }
}
