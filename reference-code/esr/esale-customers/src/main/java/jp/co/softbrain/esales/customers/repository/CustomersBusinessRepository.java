package jp.co.softbrain.esales.customers.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.CustomersBusiness;

/**
 * CustomersBusinessRepository
 *
 * @author lequyphuc
 */
@XRayEnabled
@Repository
public interface CustomersBusinessRepository extends JpaRepository<CustomersBusiness, Long> {

    /**
     * Find by BusinessId
     * 
     * @param id
     *            BusinessId
     * @return
     */
    Optional<CustomersBusiness> findByCustomerBusinessId(Long id);

    /**
     * Delete a entity with id
     * 
     * @param customerBusinessId
     */
    @Modifying(clearAutomatically = true)
    void deleteByCustomerBusinessId(Long customerBusinessId);

}
