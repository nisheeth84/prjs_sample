package jp.co.softbrain.esales.customers.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.CustomersHistories;

/**
 * CustomersRepository for managing {@link CustomersHistories}
 * 
 * @author buithingocanh
 */
@Repository
@XRayEnabled
public interface CustomersHistoriesRepository extends JpaRepository<CustomersHistories, Long> {

    /**
     * Delete all record by given customerId
     * 
     * @param customerId
     *            - id customer to delete
     */
    @Modifying(clearAutomatically = true)
    void deleteByCustomerId(Long customerId);

    /**
     * Find by Customer history id
     * 
     * @param customerHistoryId
     *            customerHistoryId
     * @return the optional DTO
     */
    Optional<CustomersHistories> findByCustomerHistoryId(Long customerHistoryId);

    /**
     * Delete by customerHistoryId
     * 
     * @param customerHistoryId
     */
    @Modifying(clearAutomatically = true)
    void deleteByCustomerHistoryId(Long customerHistoryId);

    /**
     * find all by customer id
     * 
     * @param customerIds
     *            list customer id
     * @return list Customer History
     */
    List<CustomersHistories> findByCustomerIdIn(List<Long> customerIds);

    /**
     * find all by customer id
     * 
     * @param customerIds
     *        list customer id
     * @return list Customer History
     */
    List<CustomersHistories> findAllByCustomerId(Long customerId, Pageable pageable);

    /**
     * Delete record by customer Ids
     * 
     * @param customerIds - list id to delete
     */
    @Modifying(clearAutomatically = true)
    public void deleteByCustomerIdIn(List<Long> customerIds);

}
