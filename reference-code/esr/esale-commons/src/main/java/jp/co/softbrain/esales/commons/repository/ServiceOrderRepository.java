package jp.co.softbrain.esales.commons.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.MenuServiceOrder;

/**
 * ServiceOrderRepository
 *
 * @author ThaiVV
 */
@Repository
@XRayEnabled
public interface ServiceOrderRepository extends JpaRepository<MenuServiceOrder, Long> {

    /**
     * find By Service Id
     *
     * @param serviceId
     * @return data after find
     */
    Optional<MenuServiceOrder> findByServiceId(Long serviceId);

    /**
     * find All By Employee Id Order By Service Order Asc
     *
     * @param employeeId
     * @return data after find
     */
    Optional<MenuServiceOrder> findByEmployeeIdAndServiceId(Long employeeId, Long serviceIds);

    /**
     * find max value of service_order
     * 
     * @return max value of service_order
     */
    @Query(value = "SELECT MAX(mso.service_order) FROM menu_service_order mso ", nativeQuery = true)
    Integer findMaxServiceOrder();
}
