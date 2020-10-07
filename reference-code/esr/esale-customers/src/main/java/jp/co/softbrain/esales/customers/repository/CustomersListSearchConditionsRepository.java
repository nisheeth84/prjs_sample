package jp.co.softbrain.esales.customers.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.CustomersListSearchConditions;

/**
 * Repository for managing {@link CustomersListSearchConditions}
 * 
 * @author phamminhphu
 *
 */
@Repository
@XRayEnabled
public interface CustomersListSearchConditionsRepository extends JpaRepository<CustomersListSearchConditions, Long> {

    /**
     * Get all CustomersListSearchConditions with customer_list_id
     * 
     * @param customerListId the condition
     * @return the list entity data
     */
    List<CustomersListSearchConditions> findByCustomerListId(Long customerListId);

    /**
     * Delete old customers_list_search_conditions by customer_list_id
     * 
     * @param customerListId the id of customers_list
     */
    @Modifying(clearAutomatically = true)
    void deleteByCustomerListId(Long customerListId);

    /**
     * get one CustomersListSearchConditions by customerListSearchConditionId
     * 
     * @param customerListSearchConditionId
     * @return
     */
    Optional<CustomersListSearchConditions> findByCustomerListSearchConditionId(Long customerListSearchConditionId);

    /**
     * Delete by customerListSearchConditionId
     * 
     * @param customerListSearchConditionId
     */
    @Modifying(clearAutomatically = true)
    void deleteByCustomerListSearchConditionId(Long customerListSearchConditionId);

}
