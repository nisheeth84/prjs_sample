package jp.co.softbrain.esales.customers.service.impl;

import java.util.ArrayList;
import java.util.LinkedList;
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
import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.domain.CustomersListSearchConditions;
import jp.co.softbrain.esales.customers.repository.CustomersListSearchConditionsRepository;
import jp.co.softbrain.esales.customers.security.SecurityUtils;
import jp.co.softbrain.esales.customers.service.CustomersListSearchConditionsService;
import jp.co.softbrain.esales.customers.service.CustomersListService;
import jp.co.softbrain.esales.customers.service.dto.CustomerListSearchConditionInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListSearchConditionsDTO;
import jp.co.softbrain.esales.customers.service.dto.GetListSearchConditionInfoResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.GetCustomFieldsInfoByFieldIdsRequest;
import jp.co.softbrain.esales.customers.service.mapper.CustomersListSearchConditionsMapper;
import jp.co.softbrain.esales.customers.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * Service Implementation for managing {@link CustomersListSearchConditions}
 * 
 * @author phamminhphu
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class CustomersListSearchConditionsServiceImpl implements CustomersListSearchConditionsService {

    @Autowired
    private CustomersListSearchConditionsRepository cuListSearchConditionsRepository;

    @Autowired
    private CustomersListSearchConditionsMapper cuListSearchConditionsMapper;

    @Autowired
    private CustomersListService customersListService;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListSearchConditionsService#save(jp.co.softbrain.esales.customers.service.dto.CustomersListSearchConditionsDTO)
     */
    @Override
    public CustomersListSearchConditionsDTO save(CustomersListSearchConditionsDTO dto) {
        CustomersListSearchConditions entity = cuListSearchConditionsMapper.toEntity(dto);
        entity = cuListSearchConditionsRepository.save(entity);
        return cuListSearchConditionsMapper.toDto(entity);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListSearchConditionsService#delete(java.lang.Long)
     */
    @Override
    @Transactional
    public void delete(Long id) {
        cuListSearchConditionsRepository.deleteByCustomerListSearchConditionId(id);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListSearchConditionsService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Optional<CustomersListSearchConditionsDTO> findOne(Long id) {
        return cuListSearchConditionsRepository.findByCustomerListSearchConditionId(id)
                .map(cuListSearchConditionsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListSearchConditionsService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public Page<CustomersListSearchConditionsDTO> findAll(Pageable pageable) {
        return cuListSearchConditionsRepository.findAll(pageable).map(cuListSearchConditionsMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListSearchConditionsService#findAll()
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<CustomersListSearchConditionsDTO> findAll() {
        return cuListSearchConditionsRepository.findAll().stream().map(cuListSearchConditionsMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListSearchConditionsService#saveAll(java.util.List)
     */
    @Override
    public List<CustomersListSearchConditionsDTO> saveAll(List<CustomersListSearchConditionsDTO> listParticipantsDTOs) {
        List<CustomersListSearchConditions> customersListParticipants = cuListSearchConditionsMapper
                .toEntity(listParticipantsDTOs);
        cuListSearchConditionsRepository.saveAll(customersListParticipants);
        return cuListSearchConditionsMapper.toDto(customersListParticipants);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListSearchConditionsService#getListSearchConditions(java.lang.Long)
     */
    @Override
    @Transactional(propagation=Propagation.SUPPORTS, readOnly = true)
    public List<CustomersListSearchConditionsDTO> getListSearchConditions(Long customerListId) {
        return cuListSearchConditionsMapper.toDto(cuListSearchConditionsRepository.findByCustomerListId(customerListId));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListSearchConditionsService#deleteByCustomerListId(java.lang.Long)
     */
    @Override
    @Transactional
    public void deleteByCustomerListId(Long customerListId) {
        cuListSearchConditionsRepository.deleteByCustomerListId(customerListId);
    }

    /**
     * @see jp.co.softbrain.esales.employees.service.EmployeesGroupSearchConditionsService#getGroupSearchConditionInfo(java.lang.Long)
     */
    @Override
    public GetListSearchConditionInfoResponse getListSearchConditionInfo(Long listId) {
        GetListSearchConditionInfoResponse response = new GetListSearchConditionInfoResponse();
        List<CustomersListSearchConditionsDTO> listListSearchConditions = this.getListSearchConditions(listId);
        List<Long> fieldIds = listListSearchConditions.stream().map(CustomersListSearchConditionsDTO::getFieldId)
                .collect(Collectors.toList());

        Optional<CustomersListDTO> customerList = customersListService.findOne(listId);
        customerList.ifPresent(customerDTO -> {
            response.setCustomerListId(customerDTO.getCustomerListId());
            response.setCustomerListName(customerDTO.getCustomerListName());
        });
        String token = SecurityUtils.getTokenValue().orElse(null);
        GetCustomFieldsInfoByFieldIdsRequest request = new GetCustomFieldsInfoByFieldIdsRequest();
        request.setFieldIds(fieldIds);
        List<CustomFieldsInfoOutDTO> fieldsList = new ArrayList<>();
        CommonFieldInfoResponse fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                ConstantsCustomers.API_GET_CUSTOM_FIELDS_INFO_BY_FIELD_ID, HttpMethod.POST, request,
                CommonFieldInfoResponse.class, token, jwtTokenUtil.getTenantIdFromToken());
        if (fieldInfoResponse != null) {
            fieldsList = fieldInfoResponse.getCustomFieldsInfo();
        }
        Map<Long, CustomFieldsInfoOutDTO> fieldMapById = fieldsList.stream()
                .collect(Collectors.toMap(CustomFieldsInfoOutDTO::getFieldId, f -> f));
        List<CustomerListSearchConditionInfoDTO> searchCondiInfoList = new ArrayList<>();
        listListSearchConditions.forEach(searchConditionDTO -> {
            CustomerListSearchConditionInfoDTO searchCondiInfo = new CustomerListSearchConditionInfoDTO();
            searchCondiInfo.setFieldId(searchConditionDTO.getFieldId());
            searchCondiInfo.setFieldName(fieldMapById.get(searchConditionDTO.getFieldId()).getFieldName());
            searchCondiInfo.setFieldLabel(fieldMapById.get(searchConditionDTO.getFieldId()).getFieldLabel());
            searchCondiInfo.setFieldType(fieldMapById.get(searchConditionDTO.getFieldId()).getFieldType());
            searchCondiInfo.setFieldOrder(searchConditionDTO.getFieldOrder());
            searchCondiInfo.setCustomerListId(searchConditionDTO.getCustomerListId());
            searchCondiInfo.setCustomerListSearchConditionId(searchConditionDTO.getCustomerListSearchConditionId());
            searchCondiInfo.setSearchOption(searchConditionDTO.getSearchOption());
            searchCondiInfo.setSearchType(searchConditionDTO.getSearchType());
            searchCondiInfo.setFieldValue(searchConditionDTO.getSearchValue());
            searchCondiInfoList.add(searchCondiInfo);
        });
        response.setCustomerListSearchConditionInfos(searchCondiInfoList);
        return response;
    }
}
