package jp.co.softbrain.esales.customers.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.CustomersListSearchConditions;

/**
 * CustomersListSearchCondtionsRepository
 *
 * @author lequyphuc
 */
@Repository
@XRayEnabled
public interface CustomersListSearchCondtionsRepository extends JpaRepository<CustomersListSearchConditions, Long> {
    /**
     * deleteByCustomerListId
     *
     * @pram customerListId : customerListId to make condtion to delete
     * @return void
     */
    @Modifying(clearAutomatically = true)
    public void deleteByCustomerListId(Long customerListId);
}
