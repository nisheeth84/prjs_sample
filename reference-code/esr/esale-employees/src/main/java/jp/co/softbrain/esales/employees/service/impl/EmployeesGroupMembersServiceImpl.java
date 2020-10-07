package jp.co.softbrain.esales.employees.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.domain.EmployeesGroupMembers;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupMembersRepository;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.EmployeesCommonService;
import jp.co.softbrain.esales.employees.service.EmployeesGroupMembersService;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupMembersDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.ValidateResponse;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesGroupMembersMapper;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.dto.commons.ValidateRequest;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link EmployeesGroupMembersService}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class EmployeesGroupMembersServiceImpl implements EmployeesGroupMembersService {

    private static final String INSERT_DATA_CHANGE_FAILED = "Insert data change failed";

    @Autowired
    private EmployeesGroupMembersRepository employeesGroupMembersRepository;

    @Autowired
    private EmployeesGroupMembersMapper employeesGroupMembersMapper;

    @Autowired
    private EmployeesCommonService employeesCommonService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private RestOperationUtils restOperationUtils;

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupMembersService#save(jp.co.softbrain.esales.employees.service.dto.EmployeesGroupMembersDTO)
     */
    @Override
    public EmployeesGroupMembersDTO save(EmployeesGroupMembersDTO employeesGroupMembersDTO) {
        EmployeesGroupMembers employeesGroupMember = employeesGroupMembersMapper.toEntity(employeesGroupMembersDTO);
        employeesGroupMember = employeesGroupMembersRepository.save(employeesGroupMember);
        return employeesGroupMembersMapper.toDto(employeesGroupMember);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupMembersService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<EmployeesGroupMembersDTO> findAll(Pageable pageable) {
        return employeesGroupMembersRepository.findAll(pageable).map(employeesGroupMembersMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupMembersService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<EmployeesGroupMembersDTO> findOne(Long id) {
        EmployeesGroupMembers employeesGroupMembers = employeesGroupMembersRepository.findByGroupMemberId(id);
        if (employeesGroupMembers != null) {
            return Optional.of(employeesGroupMembers).map(employeesGroupMembersMapper::toDto);
        }
        return Optional.empty();
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupMembersService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        employeesGroupMembersRepository.deleteById(id);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupMembersService#moveGroup(java.lang.Long,
     *      java.lang.Long, java.util.List)
     */
    @Override
    public List<Long> moveGroup(Long sourceGroupId, Long destGroupId, List<Long> employeeIds) {

        // Get employeeId from token
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // 1. Validate parameters
        this.moveGroupValidateParameters(sourceGroupId, destGroupId, employeeIds);
        List<Long> groupMemberIdsInserted = new ArrayList<>();
        List<Long> groupIds = new ArrayList<>();
        groupIds.add(sourceGroupId);
        groupIds.add(destGroupId);
        // 2. Remove the employee list from the source and target groups
        deleteByListGroupIdAndListEmployeeId(groupIds, employeeIds);
        // 3. Add the employee list to the target group
        List<EmployeesGroupMembersDTO> employeesGroupMembersDTOList = new ArrayList<>();
        for (Long item : employeeIds) {
            EmployeesGroupMembersDTO employeesGroupMembersDTO = new EmployeesGroupMembersDTO();
            employeesGroupMembersDTO.setEmployeeId(item);
            employeesGroupMembersDTO.setGroupId(destGroupId);
            employeesGroupMembersDTO.setCreatedUser(employeeId);
            employeesGroupMembersDTO.setUpdatedUser(employeeId);
            employeesGroupMembersDTOList.add(employeesGroupMembersDTO);
        }

        if (!employeesGroupMembersDTOList.isEmpty()) {
            employeesGroupMembersDTOList = this.saveAll(employeesGroupMembersDTOList);
            groupMemberIdsInserted.addAll(employeesGroupMembersDTOList.stream()
                    .map(EmployeesGroupMembersDTO::getGroupMemberId).collect(Collectors.toList()));
        }

        // 4. request create data for ElasticSearch
        if (Boolean.FALSE.equals(employeesCommonService.requestChangeDataElasticSearch(employeeIds, null, null,
                Constants.ChangeAction.UPDATE.getValue()))) {
            throw new CustomRestException(INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }

        return groupMemberIdsInserted;
    }

    /**
     * validate parameters api moveGroup
     * 
     * @param sourceGroupId
     * @param destGroupId
     * @param employeeIds
     */
    private void moveGroupValidateParameters(Long sourceGroupId, Long destGroupId, List<Long> employeeIds) {
        // a. validate nội bộ
        if (sourceGroupId == null || destGroupId == null || employeeIds == null) {
            throw new CustomRestException("Param[sourceGroupId] or Param[destGroupId] or Param[employeeIds]  is null",
                    CommonUtils.putError("sourceGroupId/destGroupId/employeeIds", Constants.RIQUIRED_CODE));
        }

        // b. validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put("sourceGroupId", sourceGroupId);
        fixedParams.put("destGroupId", destGroupId);
        fixedParams.put(ConstantsEmployees.PARAM_EMPLOYEE_IDS, employeeIds);
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
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupMembersService#addGroup(java.lang.Long,
     *      java.util.List)
     */
    @Override
    public List<Long> addGroup(Long groupId, List<Long> employeeIds) {
        // Get employeeId from token

        List<Long> groupMemberIdsInserted = new ArrayList<>();

        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // 1. Validate parameters
        this.addGroupValidateParameters(groupId, employeeIds);
        // 2. Delete the employee list from the add group in case it exists
        deleteByGroupIdAndEmployeeId(groupId, employeeIds);
        // 3. Add the employee list to the group
        List<EmployeesGroupMembersDTO> employeesGroupMembersDTOList = new ArrayList<>();
        for (Long item : employeeIds) {
            EmployeesGroupMembersDTO employeesGroupMembersDTO = new EmployeesGroupMembersDTO();
            employeesGroupMembersDTO.setEmployeeId(item);
            employeesGroupMembersDTO.setGroupId(groupId);
            employeesGroupMembersDTO.setCreatedUser(employeeId);
            employeesGroupMembersDTO.setUpdatedUser(employeeId);
            employeesGroupMembersDTOList.add(employeesGroupMembersDTO);
        }
        if (!employeesGroupMembersDTOList.isEmpty()) {
            employeesGroupMembersDTOList = this.saveAll(employeesGroupMembersDTOList);
            groupMemberIdsInserted.addAll(employeesGroupMembersDTOList.stream()
                    .map(EmployeesGroupMembersDTO::getGroupMemberId).collect(Collectors.toList()));
        }

        // 4. request create data for ElasticSearch
        if (Boolean.FALSE.equals(employeesCommonService.requestChangeDataElasticSearch(employeeIds, null, null,
                Constants.ChangeAction.UPDATE.getValue()))) {
            throw new CustomRestException(INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }

        return groupMemberIdsInserted;
    }

    /**
     * validate parameters api addGroup
     * 
     * @param groupId
     *            the groupId of the entity.
     * @param employeeIds
     *            the employeeId list of the entity.
     */
    private void addGroupValidateParameters(Long groupId, List<Long> employeeIds) {
        // a. validate nội bộ
        if (groupId == null || employeeIds == null) {
            throw new CustomRestException("Param[groupId] or Param[employeeIds] is null",
                    CommonUtils.putError("groupId/employeeIds", Constants.RIQUIRED_CODE));
        }

        // b. validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsEmployees.GROUP_ID, groupId);
        fixedParams.put(ConstantsEmployees.PARAM_EMPLOYEE_IDS, employeeIds);
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
     * Delete the employee list from the add group in case it exists
     * 
     * @param groupId
     *            the groupId of the entity.
     * @param employeeIds
     *            the employeeId list of the entity.
     */
    private void deleteByGroupIdAndEmployeeId(Long groupId, List<Long> employeeIds) {
        employeesGroupMembersRepository.deleteByGroupIdAndEmployeeId(groupId, employeeIds);
    }

    /**
     * Delete the employee list from the group in case it exists
     * 
     * @param groupIds
     *            the list of groupId
     * @param employeeIds
     *            the list of employeeId
     */
    private void deleteByListGroupIdAndListEmployeeId(List<Long> groupIds, List<Long> employeeIds) {
        employeesGroupMembersRepository.deleteByGroupIdsAndEmployeeIds(groupIds, employeeIds);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupMembersService#saveAll(java.util.List)
     */
    @Override
    public List<EmployeesGroupMembersDTO> saveAll(List<EmployeesGroupMembersDTO> employeesGroupMemberDTOList) {
        List<EmployeesGroupMembers> employeesGroupMemberList = employeesGroupMembersMapper
                .toEntity(employeesGroupMemberDTOList);
        employeesGroupMembersRepository.saveAll(employeesGroupMemberList);
        return employeesGroupMembersMapper.toDto(employeesGroupMemberList);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupMembersService#deleteEmployeesGroupByGroupId(java.lang.Long)
     */
    @Override
    public void deleteEmployeesGroupByGroupId(Long groupId) {
        employeesGroupMembersRepository.deleteByGroupId(groupId);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupMembersService#leaveGroup(java.lang.Long,
     *      java.util.List)
     */
    @Override
    public List<Long> leaveGroup(Long groupId, List<Long> employeeIds) {
        // 1.validate parameters
        if (groupId == null) {
            throw new CustomRestException("Param [groupId] is null.",
                    CommonUtils.putError(ConstantsEmployees.GROUP_ID, Constants.RIQUIRED_CODE));
        }
        if (groupId <= 0) {
            throw new CustomRestException("Param [groupId] is not Nagative.",
                    CommonUtils.putError(ConstantsEmployees.GROUP_ID, Constants.NUMBER_NOT_NEGATIVE));
        }
        if (employeeIds == null || employeeIds.isEmpty()) {
            throw new CustomRestException("Param [employeeIds] is not  null and not empty.",
                    CommonUtils.putError(ConstantsEmployees.PARAM_EMPLOYEE_IDS, Constants.RIQUIRED_CODE));
        }
        // validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        int index = 0;
        Map<String, Object> fixedParams = new HashMap<>();
        for (Long employeeId : employeeIds) {
            fixedParams.put(ConstantsEmployees.PARAM_EMPLOYEE_ID + index, employeeId);
            index++;
        }
        String validateJson = jsonBuilder.build(FieldBelong.EMPLOYEE.getValue(), fixedParams,
                (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        // Validate commons
        ValidateRequest validateRequest = new ValidateRequest(validateJson);
        ValidateResponse response = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.URL_API_VALIDATE, HttpMethod.POST, validateRequest, ValidateResponse.class, token,
                jwtTokenUtil.getTenantIdFromToken());
        if (response.getErrors() != null && !response.getErrors().isEmpty()) {
            throw new CustomRestException(ConstantsEmployees.VALIDATE_MSG_FAILED, response.getErrors());
        }

        employeesGroupMembersRepository.deleteByGroupIdAndEmployeeIdIn(groupId, employeeIds);

        // 3. request create data for ElasticSearch
        if (Boolean.FALSE.equals(employeesCommonService.requestChangeDataElasticSearch(employeeIds, null, null,
                Constants.ChangeAction.UPDATE.getValue()))) {
            throw new CustomRestException(INSERT_DATA_CHANGE_FAILED,
                    CommonUtils.putError(StringUtils.EMPTY, Constants.CONNECT_FAILED_CODE));
        }

        return employeeIds;
    }
}
