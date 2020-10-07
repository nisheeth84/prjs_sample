package jp.co.softbrain.esales.customers.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.CustomersListMembers;

/**
 * Spring Data repository for the CustomersListMembers entity
 * 
 * @author lequyphuc
 */
@Repository
@XRayEnabled
public interface CustomersListMembersRepository extends JpaRepository<CustomersListMembers, Long> {

    /**
     * Get Information of List Member
     * 
     * @pram customerListId - condition to get data
     * @return customer id list
     */
    @Query(value = "SELECT customer_id "
            + "FROM customers_list_members AS customer_list_member "
            + "WHERE customer_list_member.customer_list_id = :customerListId", nativeQuery = true)
    public List<Long> getInformationOfListMember(@Param("customerListId") Long customerListId);

    /**
     * Delete by customer list id and customer id list
     * 
     * @pram customerListId condition to delete
     * @param customerIds condition to delete
     */
    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE "
            + "FROM customers_list_members "
            + "WHERE customer_list_id = :customerListId "
            + "  AND customer_id IN (:customerIds)", nativeQuery = true)
    public void deleteByCustomerListIdAndCustomerIds(@Param("customerListId") Long customerListId,
            @Param("customerIds") List<Long> customerIds);

    /**
     * Delete By customer list id
     * 
     * @param customerListId customer list id get from request
     */
    @Modifying(clearAutomatically = true)
    public void deleteByCustomerListId(Long customerListId);

    /**
     * Delete By customer id
     * 
     * @param customerId customer id get from request
     */
    @Modifying(clearAutomatically = true)
    public void deleteByCustomerId(Long customerId);

    /**
     * Get all CustomersListMembers in given listId and list of customerId
     * 
     * @param customerListId - id of list
     * @param customerIds - list of customers id
     * @return list of entity
     */
    List<CustomersListMembers> findByCustomerListIdAndCustomerIdIn(Long customerListId, List<Long> customerIds);

    /**
     * Get Information of List Member
     * 
     * @pram customerListIds - condition to get data
     * @return customer id list
     */
    @Query(value = "SELECT customer_id " 
            + "FROM customers_list_members "
            + "WHERE customers_list_members.customer_list_id IN (:customerListIds) ", nativeQuery = true)
    public List<Long> getCustomerIdOfListMember(@Param("customerListIds") List<Long> customerListIds);

    /**
     * find by customer list member customerListMemberId
     * 
     * @param customerListMemberId
     * @return optional DTO response
     */
    public Optional<CustomersListMembers> findByCustomerListMemberId(Long customerListMemberId);

    /**
     * Delete by customerListMemberId
     * 
     * @param customerListMemberId
     */
    @Modifying(clearAutomatically = true)
    public void deleteByCustomerListMemberId(Long customerListMemberId);

    /**
     * Delete record by customer Ids
     * 
     * @param customerIds - list id to delete
     */
    @Modifying(clearAutomatically = true)
    public void deleteByCustomerIdIn(List<Long> customerIds);

}
