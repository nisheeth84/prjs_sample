package jp.co.softbrain.esales.commons.repository;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.service.dto.GetResultServiceOrderDTO;

/**
 * Service Order Repository Custom
 * 
 * @author ThaiVV
 */
@XRayEnabled
public interface ServiceOrderRepositoryCustom {

    /**
     * findByEmployeeIdAndServiceId : find by employee id and serviceId
     * 
     * @param employeeId : employee id
     * @param serviceId : service id
     * @return list DTO out for api getServiceOrder
     */
    List<GetResultServiceOrderDTO> findByEmployeeIdAndServiceId(Long employeeId, List<Long> serviceId);
}
