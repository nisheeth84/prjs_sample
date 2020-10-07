package jp.co.softbrain.esales.commons.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.commons.config.ConstantsCommon;
import jp.co.softbrain.esales.commons.domain.MenuServiceOrder;
import jp.co.softbrain.esales.commons.repository.ServiceOrderRepository;
import jp.co.softbrain.esales.commons.repository.ServiceOrderRepositoryCustom;
import jp.co.softbrain.esales.commons.service.ServiceOrderService;
import jp.co.softbrain.esales.commons.service.ValidateService;
import jp.co.softbrain.esales.commons.service.dto.GetResultServiceOrderDTO;
import jp.co.softbrain.esales.commons.service.dto.GetServiceOrderOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetServiceOrderSubTypeDTO;
import jp.co.softbrain.esales.commons.service.dto.ServiceOrderDTO;
import jp.co.softbrain.esales.commons.service.dto.ServiceOrderOutDTO;
import jp.co.softbrain.esales.commons.service.dto.ServiceOrderSubTypesDTO;
import jp.co.softbrain.esales.commons.service.mapper.ServiceOrderMapper;
import jp.co.softbrain.esales.commons.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.commons.web.rest.errors.CustomRestException;
import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.utils.CommonUtils;
import jp.co.softbrain.esales.utils.CommonValidateJsonBuilder;

/**
 * ServiceOrderServiceImpl
 *
 * @author ThaiVV
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class ServiceOrderServiceImpl implements ServiceOrderService {

    public static final String VALIDATE_MSG_FAILED = "Validate failed";

    public static final String EMPLOYEE_ID = "employeeId";

    public static final String ERR_COM_0013 = "ERR_COM_0013";

    public static final String CHECK_EXIST_EMPLOYEE_ID = "check exist employee Id";

    public static final String SERVICE_ID = "serviceId";

    @Autowired
    ServiceOrderService serviceOrderService;

    @Autowired
    ServiceOrderMapper serviceOrderMapper;

    @Autowired
    ServiceOrderRepository serviceOrderRepository;

    @Autowired
    ValidateService validateService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ServiceOrderRepositoryCustom serviceOrderRepositoryCustom;

    /**
     * Get one serviceOrder by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public Optional<ServiceOrderDTO> findOne(Long id) {
        return serviceOrderRepository.findByServiceId(id).map(serviceOrderMapper::toDto);
    }

    /**
     * Save a serviceOrder.
     *
     * @param serviceOrderDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public ServiceOrderDTO save(ServiceOrderDTO serviceOrderDTO) {
        MenuServiceOrder entity = serviceOrderMapper.toEntity(serviceOrderDTO);
        entity = serviceOrderRepository.save(entity);
        return serviceOrderMapper.toDto(entity);
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.ServiceOrderService#createServiceOrder(Long
     *      , List)
     */
    @Override
    @Transactional
    public ServiceOrderOutDTO createServiceOrder(Long employeeId, List<ServiceOrderSubTypesDTO> data) {
        // 1.1. Call API commonValidate
        validateParameter(employeeId, data);

        // 1.2. Insert information
        for (ServiceOrderSubTypesDTO dto : data) {
            MenuServiceOrder serviceOrder = new MenuServiceOrder();
            serviceOrder.setMenuServiceOrderId(null);
            serviceOrder.setEmployeeId(employeeId);
            serviceOrder.setServiceId(dto.getServiceId());
            serviceOrder.setServiceName(dto.getServiceName());
            serviceOrder.setServiceOrder(dto.getServiceOrder());
            serviceOrder.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
            serviceOrder.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
            serviceOrderRepository.save(serviceOrder);
        }

        // 1.3. Create data response
        ServiceOrderOutDTO response = new ServiceOrderOutDTO();
        response.setEmployeeId(employeeId);
        return response;
    }

    /**
     * ValidateParameter : Validate parameter
     *
     * @param employeeId : employee id
     * @param data : parameter
     */
    private void validateParameter(Long employeeId, List<ServiceOrderSubTypesDTO> data) {
        if (employeeId == null) {
            throw new CustomRestException(CHECK_EXIST_EMPLOYEE_ID, CommonUtils.putError(EMPLOYEE_ID, ERR_COM_0013));
        }

        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();

        data.forEach(value -> {
            if (value.getServiceId() == null) {
                throw new CustomRestException("param [serviceId] is null",
                        CommonUtils.putError(SERVICE_ID, ERR_COM_0013));
            }
            if (value.getServiceName() == null || value.getServiceName().isEmpty()) {
                throw new CustomRestException("param [serviceName] is null",
                        CommonUtils.putError("serviceName", ERR_COM_0013));
            }
            if (value.getServiceOrder() == null) {
                throw new CustomRestException("param [serviceOrder] is null",
                        CommonUtils.putError("serviceOrder", ERR_COM_0013));
            }
            fixedParams.put(SERVICE_ID, value.getServiceId());
            fixedParams.put("serviceName", value.getServiceName());
            fixedParams.put("serviceOrder", value.getServiceOrder());
        });
        fixedParams.put(EMPLOYEE_ID, employeeId);

        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        List<Map<String, Object>> lstError = validateService.validate(validateJson);
        if (lstError != null && !lstError.isEmpty()) {
            throw new CustomRestException(VALIDATE_MSG_FAILED, lstError);
        }
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.ServiceOrderService#updateServiceOrder(Long
     *      , List)
     */
    @Override
    @Transactional
    public ServiceOrderOutDTO updateServiceOrder(Long employeeId, List<ServiceOrderSubTypesDTO> data) {
        // 1.1. Call API commonValidate
        validateParameter(employeeId, data);

        // 1.2. Update service priority information

        for (ServiceOrderSubTypesDTO dto : data) {
            Optional<MenuServiceOrder> menuServiceOrder = serviceOrderRepository
                    .findByEmployeeIdAndServiceId(employeeId, dto.getServiceId());
            if (!menuServiceOrder.isPresent()) {
                Integer maxServiceOrder = serviceOrderRepository.findMaxServiceOrder();
                MenuServiceOrder entity = new MenuServiceOrder();
                entity.setServiceId(dto.getServiceId());
                entity.setEmployeeId(employeeId);
                entity.setServiceOrder(maxServiceOrder == null ? ConstantsCommon.INTEGER_ONE
                        : maxServiceOrder + ConstantsCommon.INTEGER_ONE);
                entity.setServiceName(dto.getServiceName());
                entity.setCreatedUser(jwtTokenUtil.getEmployeeIdFromToken());
                entity.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
                serviceOrderRepository.save(entity);
            } else {
                menuServiceOrder
                        .filter(serviceOrderDTO -> serviceOrderDTO.getUpdatedDate().equals(dto.getUpdatedDate()))
                        .ifPresentOrElse(serviceOrderDTO -> {
                            serviceOrderDTO.setServiceOrder(dto.getServiceOrder());
                            serviceOrderDTO.setUpdatedUser(jwtTokenUtil.getEmployeeIdFromToken());
                            serviceOrderRepository.save(serviceOrderDTO);
                        }, () -> {
                            throw new CustomRestException(
                                    CommonUtils.putError("error-exclusive", Constants.EXCLUSIVE_CODE));
                        });
            }
        }

        // 1.3. Create data response
        ServiceOrderOutDTO response = new ServiceOrderOutDTO();
        response.setEmployeeId(employeeId);
        return response;
    }

    /**
     * @see jp.co.softbrain.esales.commons.service.ServiceOrderService#getServiceOrder(Long
     *      , List)
     */
    @Override
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public GetServiceOrderOutDTO getServiceOrder(Long employeeId, List<GetServiceOrderSubTypeDTO> data) {
        if (employeeId == null) {
            throw new CustomRestException(CHECK_EXIST_EMPLOYEE_ID, CommonUtils.putError(EMPLOYEE_ID, ERR_COM_0013));
        }

        // 1.1. Call API commonValidate
        CommonValidateJsonBuilder jsonBuilder = new CommonValidateJsonBuilder();
        Map<String, Object> fixedParams = new HashMap<>();
        fixedParams.put(EMPLOYEE_ID, employeeId);
        if (data != null && !data.isEmpty()) {
            fixedParams.put(SERVICE_ID, data);
        }
        String validateJson = jsonBuilder.build(null, fixedParams, (Map<String, Object>) null);
        List<Map<String, Object>> lstError = validateService.validate(validateJson);
        if (lstError != null && !lstError.isEmpty()) {
            throw new CustomRestException(VALIDATE_MSG_FAILED, lstError);
        }

        // 1.2. Get service order information
        List<Long> serviceIdsIn = new ArrayList<>();
        if (data != null && !data.isEmpty()) {
            data.forEach(getServiceOrderSubTypeDTO -> serviceIdsIn.add(getServiceOrderSubTypeDTO.getServiceId()));
        }
        List<GetResultServiceOrderDTO> serviceOrders = serviceOrderRepositoryCustom
                .findByEmployeeIdAndServiceId(employeeId, serviceIdsIn);

        GetServiceOrderOutDTO response = new GetServiceOrderOutDTO();
        List<ServiceOrderSubTypesDTO> dtos = new ArrayList<>();
        for (GetResultServiceOrderDTO menuServiceOrder : serviceOrders) {
            ServiceOrderSubTypesDTO dto = new ServiceOrderSubTypesDTO();
            dto.setServiceId(menuServiceOrder.getServiceId());
            dto.setServiceName(menuServiceOrder.getServiceName());
            dto.setServiceOrder(menuServiceOrder.getServiceOrder());
            dto.setUpdatedDate(menuServiceOrder.getUpdatedDate());
            dtos.add(dto);
        }

        // 1.3. Create data response
        response.setEmployeeId(employeeId);
        response.setData(dtos);
        return response;
    }
}
