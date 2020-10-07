package jp.co.softbrain.esales.customers.service.impl;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.config.Constants.FieldBelong;
import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.domain.CustomersListMembers;
import jp.co.softbrain.esales.customers.repository.CustomersListCustomRepository;
import jp.co.softbrain.esales.customers.repository.CustomersListMembersRepository;
import jp.co.softbrain.esales.customers.repository.CustomersListRepository;
import jp.co.softbrain.esales.customers.repository.CustomersRepository;
import jp.co.softbrain.esales.customers.security.SecurityUtils;
import jp.co.softbrain.esales.customers.service.CustomersListMembersService;
import jp.co.softbrain.esales.customers.service.CustomersListService;
import jp.co.softbrain.esales.customers.service.CustomersService;
import jp.co.softbrain.esales.customers.service.dto.AddCustomersToAutoListOutDTO;
import jp.co.softbrain.esales.customers.service.dto.AddCustomersToListOutSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.AddCustomersToListOutSubType2DTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerListMemberIdDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListMemberIdsDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersListMembersDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomersSearchConditionsDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersOutDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersOutDataInfosDTO;
import jp.co.softbrain.esales.customers.service.dto.GetInformationOfListDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.CommonFieldInfoResponse;
import jp.co.softbrain.esales.customers.service.dto.commons.CustomFieldsInfoOutDTO;
import jp.co.softbrain.esales.customers.service.dto.commons.GetCustomFieldsInfoRequest;
import jp.co.softbrain.esales.customers.service.dto.commons.RelationDataDTO;
import jp.co.softbrain.esales.customers.service.mapper.CustomersListMembersMapper;
import jp.co.softbrain.esales.customers.tenant.util.CustomersCommonUtil;
import jp.co.softbrain.esales.customers.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.customers.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.customers.web.rest.vm.response.CustomerListIdOutResponse;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.FieldBelongEnum;
import jp.co.softbrain.esales.utils.FieldTypeEnum;
import jp.co.softbrain.esales.utils.RestOperationUtils;
import jp.co.softbrain.esales.utils.dto.SearchItem;

/**
 * Service Implementation for managing {@link CustomersListMembers}
 * 
 * @author nguyenvanchien3
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class CustomersListMembersServiceImpl implements CustomersListMembersService {
    Logger log = LoggerFactory.getLogger(CustomersListMembersServiceImpl.class);
    
    @Autowired
    private CustomersListMembersMapper customersListMembersMapper;

    @Autowired
    private CustomersListMembersRepository customersListMembersRepository;

    @Autowired
    private CustomersRepository customersRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private CustomersListCustomRepository customersListCustomerRepository;

    @Autowired
    private CustomersListRepository customersListRepository;

    @Autowired
    private RestOperationUtils restOperationUtils;

    @Autowired
    private CustomersService customersService;

    @Autowired
    private CustomersListService customersListService;

    @Autowired
    private ObjectMapper objectMapper;

    public CustomersListMembersServiceImpl(CustomersListMembersMapper customersListMembersMapper) {
        this.customersListMembersMapper = customersListMembersMapper;
    }

    /**
     * @seejp.co.softbrain.esales.customers.service.CustomersListMembersService#save(jp.co.softbrain.esales.customers.service.dto.CustomersListMembersDTO)
     */
    @Override
    public CustomersListMembersDTO save(CustomersListMembersDTO dto) {
        CustomersListMembers entity = customersListMembersMapper.toEntity(dto);
        entity = customersListMembersRepository.save(entity);
        return customersListMembersMapper.toDto(entity);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListMembersService#delete(java.lang.Long)
     */
    @Override
    @Transactional
    public void delete(Long id) {
        customersListMembersRepository.deleteByCustomerListMemberId(id);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListMembersService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<CustomersListMembersDTO> findOne(Long id) {
        return customersListMembersRepository.findByCustomerListMemberId(id).map(customersListMembersMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListMembersService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<CustomersListMembersDTO> findAll(Pageable pageable) {
        return customersListMembersRepository.findAll(pageable).map(customersListMembersMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListMembersService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<CustomersListMembersDTO> findAll() {
        return customersListMembersRepository.findAll().stream().map(customersListMembersMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListMembersService#saveAll(java.util.List)
     */
    @Override
    public List<CustomersListMembersDTO> saveAll(List<CustomersListMembersDTO> customersListMembersDTOs) {
        List<CustomersListMembers> cuListMembersDTOList = customersListMembersMapper.toEntity(customersListMembersDTOs);
        customersListMembersRepository.saveAll(cuListMembersDTOList);
        return customersListMembersMapper.toDto(cuListMembersDTOList);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListMembersService#addCustomersToList(java.lang.Long,
     *      java.util.List)
     */
    @Override
    public AddCustomersToListOutSubType1DTO addCustomersToList(Long customerListId, List<Long> customerIds) {
        // 1. validate parameters
        // 1.1 validate required parameters
        if (customerListId == null) {
            throw new CustomRestException(ConstantsCustomers.ITEM_VALUE_INVALID,
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_LIST_ID, Constants.RIQUIRED_CODE));
        }
        if (customerIds == null || customerIds.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.ITEM_VALUE_INVALID,
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_IDS, Constants.RIQUIRED_CODE));
        }
        // 1.2 validate commons
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_LIST_ID, customerListId);
        customerIds.stream()
                .forEach(id -> fixedParams.put(ConstantsCustomers.CUSTOMER_ID + customerIds.indexOf(id), id));
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
        // 2.1. Get information of member list
        List<Long> listMembersExisted = customersListMembersRepository.getInformationOfListMember(customerListId);
        // 2.2. Delete customer Id is existed out from list add
        for (Long customerId : listMembersExisted) {
            if (customerIds.contains(customerId)) {
                customerIds.remove(customerId);
            }
        }
        List<CustomersListMembers> listCustomerMemberAdd = new ArrayList<>();
        for (Long customerId : customerIds) {
            CustomersListMembers customerListMember = new CustomersListMembers();
            customerListMember.setCustomerListId(customerListId);
            customerListMember.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
            customerListMember.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
            // check customerId is existed in table customer
            if (customersRepository.findByCustomerId(customerId).isPresent()) {
                customerListMember.setCustomerId(customerId);
                listCustomerMemberAdd.add(customerListMember);
            }
        }
        // add all
        List<AddCustomersToListOutSubType2DTO> customerListMemberIds = new ArrayList<>();
        if (!listCustomerMemberAdd.isEmpty()) {
            List<CustomersListMembers> listCustomersMemberAdded = customersListMembersRepository
                    .saveAll(listCustomerMemberAdd);
            for (CustomersListMembers customersListMembersAdded : listCustomersMemberAdded) {
                AddCustomersToListOutSubType2DTO outSubType2 = new AddCustomersToListOutSubType2DTO();
                outSubType2.setCustomerListMemberId(customersListMembersAdded.getCustomerListMemberId());
                customerListMemberIds.add(outSubType2);
            }
        }

        AddCustomersToListOutSubType1DTO outDto = new AddCustomersToListOutSubType1DTO();
        outDto.setCustomerListMemberIds(customerListMemberIds);
        return outDto;
    }

    /*
     * (non-javadoc)
     * 
     * @see jp.co.softbrain.esales.customers.service.CustomersListMembersService#
     * deleteCustomerOutOfList(java.lang.Long, java.util.List)
     */
    @Override
    @Transactional
    public CustomerListIdOutResponse deleteCustomerOutOfList(Long customerListId, List<Long> customerIds) {
        // 1.Validate parameter
        if (customerListId == null) {
            throw new CustomRestException("Param[customerListId] is not null",
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_LIST_ID, Constants.RIQUIRED_CODE));
        }
        if (customerIds == null) {
            throw new CustomRestException("Param[customerIds] is not null",
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_IDS, Constants.RIQUIRED_CODE));
        }
        // Validate common
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_LIST_ID, customerListId);
        int count = 0;
        for (Long customerId : customerIds) {
            fixedParams.put(ConstantsCustomers.CUSTOMER_ID + count, customerId);
            count++;
        }
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        String validateJson = jsonBuilder.build(FieldBelong.CUSTOMER.getValue(), fixedParams,
                (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
        // 2. Delete member from list
        customersListMembersRepository.deleteByCustomerListIdAndCustomerIds(customerListId, customerIds);
        // 4. Create response data for the API
        CustomerListIdOutResponse customerIdsDTO = new CustomerListIdOutResponse();
        customerIdsDTO.setCustomerIds(customerIds);
        return customerIdsDTO;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListMembersService#moveCustomersToOtherList(java.lang.Long,
     *      java.lang.Long, java.util.List)
     */
    @Override
    @Transactional
    public CustomersListMemberIdsDTO moveCustomersToOtherList(Long sourceListId, Long destListId,
            List<Long> customerIds) {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // 1. Validate parameters
        // Validate required parameters
        if (sourceListId == null) {
            throw new CustomRestException("Param[sourceListId]",
                    CommonUtils.putError(ConstantsCustomers.SOURCE_LIST_ID, Constants.RIQUIRED_CODE));
        }
        if (destListId == null) {
            throw new CustomRestException("Param[destListId]",
                    CommonUtils.putError(ConstantsCustomers.DEST_LIST_ID, Constants.RIQUIRED_CODE));
        }
        if (customerIds == null || customerIds.isEmpty()) {
            throw new CustomRestException("Param[customerIds]",
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_IDS, Constants.RIQUIRED_CODE));
        }
        // Call method validate common
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.SOURCE_LIST_ID, sourceListId);
        fixedParams.put(ConstantsCustomers.DEST_LIST_ID, destListId);
        int count = 0;
        for (Long customerId : customerIds) {
            fixedParams.put(ConstantsCustomers.CUSTOMER_ID + count, customerId);
            count++;
        }
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }

        // 2. Delete list employee from list orginal moving
        customersListMembersRepository.deleteByCustomerListIdAndCustomerIds(sourceListId, customerIds);
        // Remove customer id existed
        List<Long> listMembersExisted = customersListMembersRepository.getInformationOfListMember(destListId);
        if (listMembersExisted != null && !listMembersExisted.isEmpty()) {
            customerIds = customerIds.stream().filter(id -> !listMembersExisted.contains(id))
                    .collect(Collectors.toList());
        }
        // 3. Add list employee into list will move
        CustomersListMemberIdsDTO customersListMemberIdsDTO = new CustomersListMemberIdsDTO();
        List<CustomerListMemberIdDTO> listCustomerMemberId = new ArrayList<>();
        // if find customer_list_id = destListId in table customers_list ->
        // update
        for (Long customerId : customerIds) {
            // if find customer_id = customerId in table customers -> implement
            // next step else check other customerId
            if (!customersRepository.findByCustomerId(customerId).isPresent()) {
                continue;
            }
            CustomersListMembers customersListMembers = new CustomersListMembers();
            customersListMembers.setCustomerListId(destListId);
            customersListMembers.setCreatedUser(employeeId);
            customersListMembers.setUpdatedUser(employeeId);
            customersListMembers.setCustomerId(customerId);
            CustomerListMemberIdDTO customerMemberIdDTO = new CustomerListMemberIdDTO();
            customerMemberIdDTO.setCustomerListMemberId(
                    customersListMembersRepository.save(customersListMembers).getCustomerListMemberId());
            listCustomerMemberId.add(customerMemberIdDTO);
        }
        customersListMemberIdsDTO.setCustomerListMemberIds(listCustomerMemberId);
        return customersListMemberIdsDTO;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListMembersService#refreshAutoList(java.lang.Long)
     */
    @Override
    @Transactional
    public AddCustomersToAutoListOutDTO refreshAutoList(Long idOfList) {
        // 1.Common processing
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        AddCustomersToAutoListOutDTO response = new AddCustomersToAutoListOutDTO();
        // 2.Validate parameters common
        if (idOfList == null) {
            throw new CustomRestException("Param[customerListId] is null",
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_LIST_ID, Constants.RIQUIRED_CODE));
        }
        // 2.2. Call method validate commons
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_LIST_ID, idOfList);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }

        // 2 Get information of List
        List<GetInformationOfListDTO> listInformation = customersListCustomerRepository.getInformationOfList(idOfList);
        boolean isOverWrite = false;
        // 3.Check avaiable
        if (listInformation == null || listInformation.isEmpty()
                || !Boolean.TRUE.equals(listInformation.get(0).getIsAutoList())) {
            throw new CustomRestException("The list by this ID has no longer existed or it is not autoList",
                    CommonUtils.putError(idOfList + "", ConstantsCustomers.ERR_COM_0050));
        }
        if (listInformation.get(0).getIsOverWrite() != null) {
            isOverWrite = listInformation.get(0).getIsOverWrite();
        }

        // 4. get CustomerIds
        List<Long> customerIds = getCustomerIds(listInformation);
        response.setCustomerIds(customerIds);
        // 5.update information of list members
        // 5.a. Delete old information
        if (isOverWrite) {
            customersListMembersRepository.deleteByCustomerListId(idOfList);
        } else {
            customersListMembersRepository.deleteByCustomerListIdAndCustomerIds(idOfList, customerIds);
        }
        /*
         * 5.b. Insert member list get from No.4
         * / find with customerListId -> in table customersList is exsited ?
         * if not exsited -> throw message
         */
        if (!customersListRepository.findByCustomerListId(idOfList).isPresent()) {
            throw new CustomRestException("The list by this ID has no longer existedt",
                    CommonUtils.putError(idOfList + "", ConstantsCustomers.ERR_COM_0050));
        }
        boolean checkInsert = false;
        for (Long customerId : customerIds) {
            CustomersListMembers customerListMember = new CustomersListMembers();
            customerListMember.setCreatedUser(employeeId);
            customerListMember.setUpdatedUser(employeeId);
            customerListMember.setCustomerListId(idOfList);
            if (!customersRepository.findByCustomerId(customerId).isPresent()) {
                continue;
            }
            checkInsert = true;
            customerListMember.setCustomerId(customerId);
            customersListMembersRepository.save(customerListMember);
        }

        // if loop to last element of customerIds but dont find customerId equal
        // customerId -> return null
        if (!checkInsert) {
            return null;
        }
        response.setCustomerListId(idOfList);
        // 6. Update last_updated_date
        Optional<CustomersListDTO> customerListDTO = customersListService.findOne(idOfList);
        customerListDTO.ifPresent(cus -> {
            cus.setLastUpdatedDate(Instant.now());
            customersListService.save(cus);
        });

        return response;
    }

    /**
     * Get customer Id list
     * 
     * @pram
     * @return List<Long>
     * @throws IOException
     */
    public List<Long> getCustomerIds(List<GetInformationOfListDTO> listInformation) {
        // 4.a. Get information of funtion's category
        List<CustomFieldsInfoOutDTO> fieldsList = new ArrayList<>();

        // ( call API getCustomFieldsInfo)
        GetCustomFieldsInfoRequest fieldInfoRequest = new GetCustomFieldsInfoRequest();
        fieldInfoRequest.setFieldBelong(FieldBelongEnum.CUSTOMER.getCode());
        CommonFieldInfoResponse fieldInfoResponse = null;
        try {
            fieldInfoResponse = restOperationUtils.executeCallApi(Constants.PathEnum.COMMONS,
                    ConstantsCustomers.API_GET_CUSTOM_FIELDS_INFO, HttpMethod.POST, fieldInfoRequest,
                    CommonFieldInfoResponse.class, SecurityUtils.getTokenValue().orElse(null),
                    jwtTokenUtil.getTenantIdFromToken());
            fieldsList.addAll(fieldInfoResponse.getCustomFieldsInfo());
        } catch (Exception e) {
            throw new CustomRestException(e.getMessage(),
                    CommonUtils.putError(e.getMessage(), e.getLocalizedMessage()));
        }

        // 4.b.make search_condiontions
        List<SearchItem> searchConditions = new ArrayList<>();
        // loop listInformation
        for (GetInformationOfListDTO information : listInformation) {
            CustomFieldsInfoOutDTO field = fieldsList.stream()
                    .filter(f -> f.getFieldId().equals(information.getFieldId())).findAny().orElse(null);
            if (field == null) {
                continue;
            }
            SearchItem searchCondtion = new SearchItem();
            searchCondtion.setFieldId(field.getFieldId());
            searchCondtion.setFieldType(field.getFieldType());
            searchCondtion.setIsDefault(String.valueOf(field.getIsDefault()));
            searchCondtion.setTimeZoneOffset(information.getTimeZoneOffset());
            searchCondtion.setSearchType(
                    information.getSearchType() == null ? "" : String.valueOf(information.getSearchType()));
            searchCondtion.setSearchOption(
                    information.getSearchOption() == null ? "" : String.valueOf(information.getSearchOption()));

            searchCondtion.setFieldName(field.getFieldName());
            if (CommonUtils.isTextType(field.getFieldType())) {
                searchCondtion
                        .setFieldName(
                                String.format(ConstantsCustomers.SEARCH_KEYWORD_TYPE, searchCondtion.getFieldName()));
            }
            if (Boolean.FALSE.equals(field.getIsDefault())) {
                searchCondtion.setFieldName(ConstantsCustomers.COLUMN_NAME_CUSTOMER_DATA
                        .concat(ConstantsCustomers.PERIOD)
                        .concat(searchCondtion.getFieldName().replace(ConstantsCustomers.DOT_KEYWORD, "")));
            }

            buildSearchValueForSearchItem(field, searchCondtion, information.getSearchValue());

            searchConditions.add(searchCondtion);
        }
        log.debug("**************searchConditions: {}", searchConditions);
        // 4.c. Get information of customer -> call api getCustomers
        List<Long> customerIds = new ArrayList<>();
        CustomersSearchConditionsDTO searchDto = new CustomersSearchConditionsDTO();
        searchDto.setSearchConditions(searchConditions);
        GetCustomersOutDTO customers = customersService.getCustomers(searchDto);

        if (customers == null || CollectionUtils.isEmpty(customers.getCustomers())) {
            return customerIds;
        }
        customerIds.addAll(customers.getCustomers().stream().map(GetCustomersOutDataInfosDTO::getCustomerId)
                .collect(Collectors.toList()));
        return customerIds;
    }

    /**
     * build search value for search item
     * 
     * @param field
     * @param searchCondtion
     * @param searchValue
     * @return
     */
    private void buildSearchValueForSearchItem(CustomFieldsInfoOutDTO field, SearchItem searchItem,
            String searchValue) {
        log.debug("***********************searchValue: {}", searchValue);
        if (StringUtils.isBlank(searchValue)) {
            searchItem.setFieldValue("");
            return;
        }
        // for normal field
        if (!FieldTypeEnum.RELATION.getCode().equals(String.valueOf(field.getFieldType()))) {
            searchItem.setFieldValue(searchValue);
            return;
        }

        // for relation field
        // get id from realtion service
        List<Long> listIdRelation = getIdsFromRelationService(field, searchValue);
        if (listIdRelation.isEmpty()) {
            listIdRelation.add(ConstantsCustomers.LONG_VALUE_0L);
        }
        log.debug("****************listIdRelation: {}", listIdRelation);
        searchItem.setFieldValue(listIdRelation.toString());
        log.debug("**********searchItem : {}", searchItem);
    }

    /**
     * getIdsFromRelationService
     * 
     * @param field - field
     * @param searchValue - search value
     * @return list id from relation data
     */
    private List<Long> getIdsFromRelationService(CustomFieldsInfoOutDTO field, String searchValue) {

        TypeReference<List<SearchItem>> listType = new TypeReference<List<SearchItem>>() {};

        List<SearchItem> listConditions = new ArrayList<>();

        // get list searchItem
        try {
            listConditions.addAll(objectMapper.readValue(searchValue, listType));
        } catch (Exception e) {
            log.debug("Parse Json failed, causeBy: {}", e.getLocalizedMessage());
        }
        RelationDataDTO relationData = field.getRelationData();
        if (relationData == null || relationData.getFieldBelong() == null) {
            return new ArrayList<>();
        }
        log.debug("*********************listConditions : {}", listConditions);

        if (FieldBelongEnum.ACTIVITY.getCode().equals(relationData.getFieldBelong())) {
            return CustomersCommonUtil.getIdsRelationFromActivities(listConditions, restOperationUtils);
        }
        if (FieldBelongEnum.BUSINESS_CARD.getCode().equals(relationData.getFieldBelong())) {
            return CustomersCommonUtil.getIdsRelationFromBusinessCards(listConditions, restOperationUtils);
        }
        if (FieldBelongEnum.CUSTOMER.getCode().equals(relationData.getFieldBelong())) {
            return CustomersCommonUtil.getIdsRelationFromCustomers(listConditions, restOperationUtils);
        }
        if (FieldBelongEnum.EMPLOYEE.getCode().equals(relationData.getFieldBelong())) {
            return CustomersCommonUtil.getIdsRelationFromEmployees(listConditions, restOperationUtils);
        }
        if (FieldBelongEnum.PRODUCT.getCode().equals(relationData.getFieldBelong())) {
            return CustomersCommonUtil.getIdsRelationFromProducts(listConditions, restOperationUtils);
        }
        if (FieldBelongEnum.TASK.getCode().equals(relationData.getFieldBelong())) {
            return CustomersCommonUtil.getIdsRelationFromTasks(listConditions, restOperationUtils);
        }
        if (FieldBelongEnum.TRADING_PRODUCT.getCode().equals(relationData.getFieldBelong())) {
            return CustomersCommonUtil.getIdsRelationFromSales(listConditions, restOperationUtils);
        }

        return new ArrayList<>();
    }

}
