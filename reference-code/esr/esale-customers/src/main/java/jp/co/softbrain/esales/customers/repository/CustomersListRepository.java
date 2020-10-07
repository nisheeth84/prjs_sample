package jp.co.softbrain.esales.customers.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.CustomersList;

/**
 * CustomersRepository for managing {@link CustomersList}
 * 
 * @author phamminhphu
 */
@Repository
@XRayEnabled
public interface CustomersListRepository extends JpaRepository<CustomersList, Long> {

    /**
     * get my list
     * 
     * @param customerListId : customerListId get from request
     * @pram employeeId : employeeId : id user iterating
     * @return CustomersList entity CustomersList
     */
    @Query(value = "SELECT * "
            + "FROM customers_list cl "
            + "INNER JOIN customers_list_participants clp "
            + "        ON cl.customer_list_id = clp.customer_list_id "
            + "WHERE cl.customer_list_id = :customerListId "
            + "  AND clp.employee_id = :employeeId "
            + "  AND clp.participant_type = 2", nativeQuery = true)
    public CustomersList getMyList(@Param("customerListId") Long customerListId, @Param("employeeId") Long employeeId);

    /**
     * Find customer list by customer list id
     * 
     * @param id
     *        customerListId
     * @return the optional customerListDTO
     */
    public Optional<CustomersList> findByCustomerListId(Long customerListId);

    /**
     * Delete by customerListId
     * 
     * @param customerListId
     */
    @Modifying(clearAutomatically = true)
    public void deleteByCustomerListId(Long customerListId);

    /**
     * get list updated date by customer_list_id
     * @param selectedTargetId - id list
     * @return list updated_date
     */
    @Query(value = "SELECT c_list.last_updated_date "
            + "FROM customers_list c_list "
            + "WHERE c_list.customer_list_id =:selectedTargetId ", nativeQuery = true)
    public Instant getLastUpdatedDateByListId(@Param("selectedTargetId") Long selectedTargetId);

    /**
     * Get info by searchValue
     * @param searchValue search value
     * @param employeeId id of employee activing
     * @return List<CustomersListDTO> list info by searchValue
     */
    @Query(value = "SELECT cl.* "
            +"FROM customers_list cl "
            +"LEFT JOIN customers_list_favourites clf "
            +"        ON cl.customer_list_id = clf.customer_list_id "
            +"INNER JOIN customers_list_participants clp "
            +"        ON cl.customer_list_id = clp.customer_list_id "
            +"WHERE cl.customer_list_name LIKE :searchValue "
            +"AND clp.employee_id = :employeeId "
            +"AND clp.participant_type = 2 "
            +"ORDER BY cl.customer_list_id ASC ", nativeQuery = true)
    public List<CustomersList> getListInfoBySearchValue(@Param("searchValue") String searchValue,
            @Param("employeeId") Long employeeId);

}
