package jp.co.softbrain.esales.customers.service.impl;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.domain.CustomersBusiness;
import jp.co.softbrain.esales.customers.repository.CustomersBusinessRepository;
import jp.co.softbrain.esales.customers.security.SecurityUtils;
import jp.co.softbrain.esales.customers.service.CustomersBusinessService;
import jp.co.softbrain.esales.customers.service.dto.CustomersBusinessDTO;
import jp.co.softbrain.esales.customers.service.dto.FieldItemDTO;
import jp.co.softbrain.esales.customers.service.dto.GetSpecialItemsOutDTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeEditModeOutDTO;
import jp.co.softbrain.esales.customers.service.dto.InitializeEditModeOutSubTypeDTO;
import jp.co.softbrain.esales.customers.service.dto.SpecialItemDTO;
import jp.co.softbrain.esales.customers.service.mapper.CustomersBusinessMapper;
import jp.co.softbrain.esales.customers.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonUtils;

/**
 * Service Implementation for managing {@link CustomersBusiness}
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class CustomersBusinessServiceImpl implements CustomersBusinessService {

    @Autowired
    private CustomersBusinessMapper customersBusinessMapper;

    @Autowired
    private CustomersBusinessRepository customersBusinessRepository;

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersBusinessService#save(jp.co.softbrain.esales.customers.service.dto.CustomersBusinessDTO)
     */
    @Override
    public CustomersBusinessDTO save(CustomersBusinessDTO dto) {
        CustomersBusiness entity = customersBusinessMapper.toEntity(dto);
        entity = customersBusinessRepository.save(entity);
        return customersBusinessMapper.toDto(entity);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersBusinessService#delete(java.lang.Long)
     */
    @Override
    @Transactional
    public void delete(Long id) {
        customersBusinessRepository.deleteByCustomerBusinessId(id);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersBusinessService#findOne(java.lang.Long)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<CustomersBusinessDTO> findOne(Long id) {
        return customersBusinessRepository.findByCustomerBusinessId(id).map(customersBusinessMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersBusinessService#findAll(org.springframework.data.domain.Pageable)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Page<CustomersBusinessDTO> findAll(Pageable pageable) {
        return customersBusinessRepository.findAll(pageable).map(customersBusinessMapper::toDto);
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersBusinessService#findAll()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<CustomersBusinessDTO> findAll() {
        return customersBusinessRepository.findAll().stream().map(customersBusinessMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersBusinessService#initializeEditMode()
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public InitializeEditModeOutDTO initializeEditMode() {
        // check user's authority
        if (!SecurityUtils.isCurrentUserInRole(Constants.Roles.ROLE_ADMIN)) {
            throw new CustomRestException(ConstantsCustomers.MSG_NOT_PERMISSION,
                    CommonUtils.putError(ConstantsCustomers.USER_ID_CAPTION, Constants.USER_NOT_PERMISSION));
        }
        InitializeEditModeOutDTO outDto = new InitializeEditModeOutDTO();
        this.findAll().stream().forEach(
                dto -> outDto.getBusiness().add(new InitializeEditModeOutSubTypeDTO(dto.getCustomerBusinessId(),
                                dto.getCustomerBusinessName(), dto.getCustomerBusinessParent(), dto.getUpdatedDate())));
        return outDto;
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersBusinessService#getSpecialItems()
     * @return GetSpecialItemsOutDTO the entity response
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetSpecialItemsOutDTO getSpecialItems() {
        GetSpecialItemsOutDTO fieldInfoItems = null;
        List<SpecialItemDTO> listSpecialItemDTOs = new ArrayList<>();
        List<FieldItemDTO> listFieldMain = new ArrayList<>();
        List<FieldItemDTO> listFieldSub = new ArrayList<>();
        List<CustomersBusinessDTO> listCustomerBusiness = customersBusinessRepository.findAll().stream()
                .map(customersBusinessMapper::toDto).collect(Collectors.toList());
        if (listCustomerBusiness.isEmpty()) {
            return fieldInfoItems;
        }
        SpecialItemDTO businessMain = new SpecialItemDTO();
        SpecialItemDTO businessSub = new SpecialItemDTO();
        for (CustomersBusinessDTO items : listCustomerBusiness) {
            FieldItemDTO fieldItem = new FieldItemDTO();
            fieldItem.setItemId(items.getCustomerBusinessId());
            fieldItem.setItemLabel(items.getCustomerBusinessName());
            // 1. Get businessMain
            if (items.getCustomerBusinessParent() == null) {
                businessMain.setFieldName("business_main");
                listFieldMain.add(fieldItem);
            } else {
                // 2. Get businessSub
                businessSub.setFieldName("business_sub");
                listFieldSub.add(fieldItem);
            }
        }
        // 3. Create Response API
        fieldInfoItems = new GetSpecialItemsOutDTO();
        businessMain.setFieldItems(listFieldMain);
        businessSub.setFieldItems(listFieldSub);
        listSpecialItemDTOs.add(businessMain);
        listSpecialItemDTOs.add(businessSub);
        fieldInfoItems.setFieldInfoItems(listSpecialItemDTOs);
        return fieldInfoItems;
    }

}
