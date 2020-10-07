package jp.co.softbrain.esales.employees.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.config.ConstantsEmployees;
import jp.co.softbrain.esales.employees.domain.EmployeesGroupSearchConditions;
import jp.co.softbrain.esales.employees.repository.EmployeesGroupSearchConditionsRepository;
import jp.co.softbrain.esales.employees.security.SecurityUtils;
import jp.co.softbrain.esales.employees.service.EmployeesGroupSearchConditionsService;
import jp.co.softbrain.esales.employees.service.EmployeesGroupsService;
import jp.co.softbrain.esales.employees.service.dto.EmployeeGroupSearchConditionInfoDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupSearchConditionsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesGroupsDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.employees.service.dto.commons.GetCustomFieldsInfoByFieldIdsRequest;
import jp.co.softbrain.esales.employees.service.mapper.EmployeesGroupSearchConditionsMapper;
import jp.co.softbrain.esales.employees.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetGroupSearchConditionInfoResponse;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * Service Implementation for managing {@link EmployeesGroupSearchConditions}.
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class EmployeesGroupSearchConditionsServiceImpl implements EmployeesGroupSearchConditionsService {

    @Autowired
    private final EmployeesGroupSearchConditionsRepository employeesGroupSearchConditionsRepository;

    @Autowired
    private final EmployeesGroupSearchConditionsMapper employeesGroupSearchConditionsMapper;

    @Autowired
    private EmployeesGroupsService employeesGroupsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private RestOperationUtils restOperationUtils;

    public EmployeesGroupSearchConditionsServiceImpl(
            EmployeesGroupSearchConditionsRepository employeesGroupSearchConditionsRepository,
            EmployeesGroupSearchConditionsMapper employeesGroupSearchConditionsMapper) {
        this.employeesGroupSearchConditionsRepository = employeesGroupSearchConditionsRepository;
        this.employeesGroupSearchConditionsMapper = employeesGroupSearchConditionsMapper;
    }

	/**
	 * @see jp.co.softbrain.esales.employees.service.EmployeesGroupSearchConditionsService#save(jp.co.softbrain.esales.employees.service.dto.EmployeesGroupSearchConditionsDTO)
	 */
	@Override
	public EmployeesGroupSearchConditionsDTO save(EmployeesGroupSearchConditionsDTO employeesGroupSearchConditionsDTO) {
		EmployeesGroupSearchConditions employeesGroupSearchConditions = employeesGroupSearchConditionsMapper
				.toEntity(employeesGroupSearchConditionsDTO);
		employeesGroupSearchConditions = employeesGroupSearchConditionsRepository.save(employeesGroupSearchConditions);
		return employeesGroupSearchConditionsMapper.toDto(employeesGroupSearchConditions);
	}

	/**
	 * @see jp.co.softbrain.esales.employees.service.EmployeesGroupSearchConditionsService#saveAll(java.util.List)
	 */
	@Override
	public List<EmployeesGroupSearchConditionsDTO> saveAll(
			List<EmployeesGroupSearchConditionsDTO> employeesGroupSearchConditionsDTOList) {
		List<EmployeesGroupSearchConditions> employeesGroupSearchConditionsList = employeesGroupSearchConditionsMapper
				.toEntity(employeesGroupSearchConditionsDTOList);
		employeesGroupSearchConditionsRepository.saveAll(employeesGroupSearchConditionsList);
		return employeesGroupSearchConditionsMapper.toDto(employeesGroupSearchConditionsList);
	}

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupSearchConditionsService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<EmployeesGroupSearchConditionsDTO> findAll(Pageable pageable) {
        return employeesGroupSearchConditionsRepository.findAll(pageable)
                .map(employeesGroupSearchConditionsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupSearchConditionsService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<EmployeesGroupSearchConditionsDTO> findOne(Long id) {
        EmployeesGroupSearchConditions employeesGroupSearchConditions = employeesGroupSearchConditionsRepository
                .findBySearchContentId(id);
        if (employeesGroupSearchConditions != null) {
            return Optional.of(employeesGroupSearchConditions).map(employeesGroupSearchConditionsMapper::toDto);
        }
        return Optional.empty();
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupSearchConditionsService#delete(java.lang.Long)
     */
    @Override
    public void delete(Long id) {
        employeesGroupSearchConditionsRepository.deleteById(id);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupSearchConditionsService#deleteGroupSearchByGroupId(java.lang.Long)
     */
    @Override
    public void deleteGroupSearchByGroupId(Long groupId) {
        employeesGroupSearchConditionsRepository.deleteByGroupId(groupId);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupSearchConditionsService#getGroupSearchConditions(java.lang.Long)
     */
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    @Override
    public List<EmployeesGroupSearchConditionsDTO> getGroupSearchConditions(Long groupId) {
        List<EmployeesGroupSearchConditions> listGroupSearchConditions = employeesGroupSearchConditionsRepository
                .findByGroupId(groupId);
        return employeesGroupSearchConditionsMapper.toDto(listGroupSearchConditions);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupSearchConditionsService#deleteByGroupId(java.lang.Long)
     */
    @Override
    public void deleteByGroupId(Long groupId) {
        employeesGroupSearchConditionsRepository.deleteByGroupId(groupId);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupSearchConditionsService#getGroupSearchConditionInfo(java.lang.Long)
     */
    @Override
    public GetGroupSearchConditionInfoResponse getGroupSearchConditionInfo(Long groupId) {
        GetGroupSearchConditionInfoResponse response = new GetGroupSearchConditionInfoResponse();
        List<EmployeesGroupSearchConditionsDTO> listGroupSearchConditions = this.getGroupSearchConditions(groupId);
        List<Long> fieldIds = listGroupSearchConditions.stream()
                .map(EmployeesGroupSearchConditionsDTO::getFieldId)
                .collect(Collectors.toList());

        Optional<EmployeesGroupsDTO> empGroup = employeesGroupsService.findOne(groupId);
        empGroup.ifPresent(empDto -> {
            response.setGroupId(empDto.getGroupId());
            response.setGroupName(empDto.getGroupName());
        });
        String token = SecurityUtils.getTokenValue().orElse(null);
        GetCustomFieldsInfoByFieldIdsRequest request = new GetCustomFieldsInfoByFieldIdsRequest();
        request.setFieldIds(fieldIds);
        List<CustomFieldsInfoOutDTO> fieldsList = new ArrayList<>();
        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsEmployees.ApiUrl.Commons.GET_CUSTOM_FIELDS_INFO_BY_FIELD_ID, HttpMethod.POST, request,
                CommonFieldInfoResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        if (fieldInfoResponse != null) {
            fieldsList = fieldInfoResponse.getCustomFieldsInfo();
        }
        Map<Long, CustomFieldsInfoOutDTO> fieldMapById = fieldsList.stream()
                .collect(Collectors.toMap(CustomFieldsInfoOutDTO::getFieldId, f -> f));
        List<EmployeeGroupSearchConditionInfoDTO> searchCondiInfoList = new ArrayList<>();
        listGroupSearchConditions.forEach(searchConditionDTO -> {
            EmployeeGroupSearchConditionInfoDTO searchCondiInfo = new EmployeeGroupSearchConditionInfoDTO();
            searchCondiInfo.setFieldId(searchConditionDTO.getFieldId());
            searchCondiInfo.setFieldName(fieldMapById.get(searchConditionDTO.getFieldId()).getFieldName());
            searchCondiInfo.setFieldLabel(fieldMapById.get(searchConditionDTO.getFieldId()).getFieldLabel());
            searchCondiInfo.setFieldType(fieldMapById.get(searchConditionDTO.getFieldId()).getFieldType());
            searchCondiInfo.setFieldOrder(searchConditionDTO.getFieldOrder());
            searchCondiInfo.setGroupId(searchConditionDTO.getGroupId());
            searchCondiInfo.setSearchContentId(searchConditionDTO.getSearchContentId());
            searchCondiInfo.setSearchOption(searchConditionDTO.getSearchOption());
            searchCondiInfo.setSearchType(searchConditionDTO.getSearchType());
            searchCondiInfo.setFieldValue(searchConditionDTO.getSearchValue());
            searchCondiInfoList.add(searchCondiInfo);
        });
        response.setEmployeesGroupSearchConditionInfos(searchCondiInfoList);
        return response;
    }
}
