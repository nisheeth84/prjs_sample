package jp.co.softbrain.esales.commons.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.domain.MenuFavorite;
import jp.co.softbrain.esales.commons.repository.MenuFavoriteRepository;
import jp.co.softbrain.esales.commons.service.MenuFavoriteService;
import jp.co.softbrain.esales.commons.service.ValidateService;
import jp.co.softbrain.esales.commons.service.dto.CreateServiceFavoriteOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetServiceFavoriteOutDTO;
import jp.co.softbrain.esales.commons.service.mapper.MenuFavoriteMapper;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;

/**
 * Service Implementation for managing {@link MenuFavorite}.
 *
 * @author TuanLV
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class MenuFavoriteServiceImpl implements MenuFavoriteService {

    public static final String VALIDATE_MSG_FAILED = "Validate failed";

    public static final String CHECK_EXIST_EMPLOYEE_ID = "check exist employee Id";

    public static final String CHECK_EXIST_SERVICE_ID = "check exist service Id";

    public static final String CHECK_EXIST_SERVICE_NAME = "check exist service Name";

    public static final String EMPLOYEE_ID = "employeeId";

    public static final String SERVICE_ID = "serviceId";

    public static final String ERR_COM_0013 = "ERR_COM_0013";

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private MenuFavoriteMapper menuFavoriteMapper;

    @Autowired
    private ValidateService validateService;

    private final MenuFavoriteRepository menuFavoriteRepository;

    public MenuFavoriteServiceImpl(MenuFavoriteRepository menuFavoriteRepository) {
        this.menuFavoriteRepository = menuFavoriteRepository;
    }

    /**
     * Save a menuFavorite.
     *
     * @see jp.co.softbrain.esales.commons.service.MenuFavoriteService#save()
     */
    @Override
    public MenuFavorite save(MenuFavorite menuFavorite) {
        return menuFavoriteRepository.save(menuFavorite);
    }

    /**
     * Get all the menuFavorites.
     *
     * @see jp.co.softbrain.esales.commons.service.MenuFavoriteService#findAll()
     */
    @Override
    @Transactional(readOnly = true)
    public List<MenuFavorite> findAll() {
        return menuFavoriteRepository.findAll();
    }

    /**
     * Get one menuFavorite by id.
     *
     * @see jp.co.softbrain.esales.commons.service.MenuFavoriteService#findByServiceId(Long)
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<MenuFavorite> findOne(Long id) {
        return menuFavoriteRepository.findByServiceId(id);
    }

    /**
     * Delete the menuFavorite by id.
     *
     * @see jp.co.softbrain.esales.commons.service.MenuFavoriteService#deleteById(Long)
     */
    @Override
    public void delete(Long id) {
        menuFavoriteRepository.deleteById(id);
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.MenuFavoriteService#createServiceFavorite(Long
     *      , Long , String)
     */
    @Override
    @Transactional
    public CreateServiceFavoriteOutDTO createServiceFavorite(Long employeeId, Long serviceId, String serviceName) {
        if (employeeId == null) {
            throw new CustomRestException(CHECK_EXIST_EMPLOYEE_ID, CommonUtils.putError(EMPLOYEE_ID, ERR_COM_0013));
        }
        if (serviceId == null) {
            throw new CustomRestException(CHECK_EXIST_SERVICE_ID, CommonUtils.putError(EMPLOYEE_ID, ERR_COM_0013));
        }
        if (serviceName == null) {
            throw new CustomRestException(CHECK_EXIST_SERVICE_NAME, CommonUtils.putError(EMPLOYEE_ID, ERR_COM_0013));
        }
        // 1.1. Validate parameter
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(EMPLOYEE_ID, employeeId);
        fixedParams.put(SERVICE_ID, serviceId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        List<Map<String, Object>> lstError = validateService.validate(validateJson);
        if (lstError != null && !lstError.isEmpty()) {
            throw new CustomRestException(VALIDATE_MSG_FAILED, lstError);
        }

        // 1.2. Insert service Favorite
        MenuFavorite entity = new MenuFavorite();
        entity.setEmployeeId(employeeId);
        entity.setServiceId(serviceId);
        entity.setServiceName(serviceName);
        entity.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        entity.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
        entity = menuFavoriteRepository.save(entity);

        // 1.3. create response
        CreateServiceFavoriteOutDTO response = new CreateServiceFavoriteOutDTO();
        response.setServiceId(entity.getServiceId());
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.MenuFavoriteService#deleteServiceFavorite(Long
     *      , Long )
     */
    @Override
    @Transactional
    public CreateServiceFavoriteOutDTO deleteServiceFavorite(Long employeeId, Long serviceId) {
        if (employeeId == null) {
            throw new CustomRestException(CHECK_EXIST_EMPLOYEE_ID, CommonUtils.putError(EMPLOYEE_ID, ERR_COM_0013));
        }
        if (serviceId == null) {
            throw new CustomRestException(CHECK_EXIST_SERVICE_ID, CommonUtils.putError(SERVICE_ID, ERR_COM_0013));
        }
        // 1.1. Validate parameter
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(EMPLOYEE_ID, employeeId);
        fixedParams.put(SERVICE_ID, serviceId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        List<Map<String, Object>> lstError = validateService.validate(validateJson);
        if (lstError != null && !lstError.isEmpty()) {
            throw new CustomRestException(VALIDATE_MSG_FAILED, lstError);
        }
        // 1.2. Delete service Favorite
        menuFavoriteRepository.deleteAllByServiceIdAndEmployeeId(serviceId, employeeId);
        // 1.3 create Response
        CreateServiceFavoriteOutDTO response = new CreateServiceFavoriteOutDTO();
        response.setServiceId(serviceId);
        return response;
    }

    /**
     * Get Service Favorite
     *
     * @see jp.co.softbrain.esales.commons.service.MenuFavoriteService#getServiceFavorite(Long)
     */
    @Override
    @Transactional
    public GetServiceFavoriteOutDTO getServiceFavorite(Long employeeId) {
        if (employeeId == null) {
            throw new CustomRestException(CHECK_EXIST_EMPLOYEE_ID, CommonUtils.putError(EMPLOYEE_ID, ERR_COM_0013));
        }
        // 1.1. Validate parameter
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(EMPLOYEE_ID, employeeId);
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        List<Map<String, Object>> lstError = validateService.validate(validateJson);
        if (lstError != null && !lstError.isEmpty()) {
            throw new CustomRestException(VALIDATE_MSG_FAILED, lstError);
        }
        // 1.2. get list service favorite
        List<MenuFavorite> listDto = menuFavoriteRepository.findAllByEmployeeId(employeeId);
        Set<Integer> licenses = jwtTokenUtil.getLicenses();
        // 1.3. Check service favorite
        for (MenuFavorite dto : listDto) {
            if (!licenses.contains(Integer.valueOf(dto.getServiceId().toString()))) {
                // call api deleteServiceFavorite
                deleteServiceFavorite(jwtTokenUtil.getEmployeeIdFromToken(), dto.getServiceId());
            }
        }
        // 1.4. Create response
        GetServiceFavoriteOutDTO response = new GetServiceFavoriteOutDTO();
        response.setData(menuFavoriteMapper.toDto(listDto));
        return response;
    }
}
