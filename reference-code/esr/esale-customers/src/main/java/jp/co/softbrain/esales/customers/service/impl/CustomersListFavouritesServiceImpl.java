package jp.co.softbrain.esales.customers.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.customers.config.ConstantsCustomers;
import jp.co.softbrain.esales.customers.domain.CustomersListFavourites;
import jp.co.softbrain.esales.customers.repository.CustomersListFavouritesRepository;
import jp.co.softbrain.esales.customers.security.SecurityUtils;
import jp.co.softbrain.esales.customers.service.CustomersCommonService;
import jp.co.softbrain.esales.customers.service.CustomersListFavouritesService;
import jp.co.softbrain.esales.customers.tenant.util.CustomersCommonUtil;
import jp.co.softbrain.esales.customers.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.customers.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;
import jp.co.softbrain.esales.utils.RestOperationUtils;

/**
 * CustomersListFavouritesServiceImpl
 * Service Implementation for managing {@link CustomersListFavourites}.
 *
 * @author lequyphuc
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class CustomersListFavouritesServiceImpl implements CustomersListFavouritesService {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private CustomersListFavouritesRepository customersListFavouritesRepository;

    @Autowired
    private CustomersCommonService customersCommonService;

    @Autowired
    private RestOperationUtils restOperationUtils;

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListFavouritesService#addToListFavourite(java.lang.Long)
     */
    @Override
    @Transactional
    public Long addToListFavourite(Long customerListId) {
        // processing commom
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // detail processing
        // 1.1
        if (customerListId == null) {
            throw new CustomRestException("Param[customerListId] is not null",
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_LIST_ID, Constants.RIQUIRED_CODE));
        }
        // 1.2. Validate Common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_LIST_ID, customerListId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
        // 2. regsiter list to favourite list
        CustomersListFavourites entity = new CustomersListFavourites();
        entity.setCustomerListId(customerListId);
        entity.setEmployeeId(employeeId);
        entity.setCreatedUser(employeeId);
        entity.setUpdatedUser(employeeId);
        return customersListFavouritesRepository.save(entity).getCustomerListFavouriteId();
    }

    /**
     * @see jp.co.softbrain.esales.customers.service.CustomersListFavouritesService#removeFavouriteList(java.lang.Long)
     */
    @Override
    @Transactional
    public Long removeFavouriteList(Long customerListId) {
        Long employeeId = jwtTokenUtil.getEmployeeIdFromToken();
        // 1. validate parameter
        // 1.1. validate inner
        if (customerListId == null) {
            throw new CustomRestException("Param[customerListId] is not null",
                    CommonUtils.putError(ConstantsCustomers.CUSTOMER_LIST_ID, Constants.RIQUIRED_CODE));
        }
        // 1.2.validate common
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(ConstantsCustomers.CUSTOMER_LIST_ID, customerListId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        String token = SecurityUtils.getTokenValue().orElse(null);
        String tenantName = jwtTokenUtil.getTenantIdFromToken();
        List<Map<String, Object>> errors = CustomersCommonUtil.validateCommon(validateJson, restOperationUtils, token,
                tenantName);
        if (!errors.isEmpty()) {
            throw new CustomRestException(ConstantsCustomers.VALIDATE_MSG_FAILED, errors);
        }
        // 2. delete favourite list
        customersCommonService.removeFavouriteList(employeeId, customerListId);
        return customerListId;
    }

}
