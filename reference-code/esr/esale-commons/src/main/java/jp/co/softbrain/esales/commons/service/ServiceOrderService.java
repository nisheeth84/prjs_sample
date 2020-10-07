package jp.co.softbrain.esales.commons.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.GetServiceOrderOutDTO;
import jp.co.softbrain.esales.commons.service.dto.GetServiceOrderSubTypeDTO;
import jp.co.softbrain.esales.commons.service.dto.ServiceOrderDTO;
import jp.co.softbrain.esales.commons.service.dto.ServiceOrderOutDTO;
import jp.co.softbrain.esales.commons.service.dto.ServiceOrderSubTypesDTO;

/**
 * ServiceOrderService
 *
 * @author ThaiVV
 */
@XRayEnabled
public interface ServiceOrderService {

    /**
     * Get the "id" serviceOrder.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ServiceOrderDTO> findOne(Long id);

    /**
     * Save a serviceOrder.
     *
     * @param serviceOrder the entity to save.
     * @return the persisted entity.
     */
    ServiceOrderDTO save(ServiceOrderDTO serviceOrderDTO);

    /**
     * createServiceOrder
     *
     * @param employeeId
     * @param data
     * @return ServiceOrderOutDTO
     */
    ServiceOrderOutDTO createServiceOrder(Long employeeId, List<ServiceOrderSubTypesDTO> data);

    /**
     * update Service Order
     *
     * @param employeeId
     * @param data
     * @return ServiceOrderOutDTO : the entity
     */
    ServiceOrderOutDTO updateServiceOrder(Long employeeId, List<ServiceOrderSubTypesDTO> data);

    /**
     * get Service Order
     *
     * @param employeeId
     * @param data
     * @return GetServiceOrderOutDTO : the entity
     */
    GetServiceOrderOutDTO getServiceOrder(Long employeeId, List<GetServiceOrderSubTypeDTO> data);
}
