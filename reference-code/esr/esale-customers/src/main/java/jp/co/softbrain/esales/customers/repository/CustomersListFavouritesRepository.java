package jp.co.softbrain.esales.customers.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.CustomersListFavourites;

/**
 * CustomersListFavouritesRepository
 *
 * @author lequyphuc
 */
@Repository
@XRayEnabled
public interface CustomersListFavouritesRepository extends JpaRepository<CustomersListFavourites, Long> {

    /**
     * Delete record by given customerListId and employeeId
     * 
     * @param customerListId - condition
     * @param employeeId - condition
     */
    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE "
                  +"FROM customers_list_favourites clf " 
                  +"WHERE clf.customer_list_id = :customerListId "
                  +"  AND clf.employee_id = :employeeId ", nativeQuery = true)
    void deleteByCustomerListIdAndEmployeeId(@Param("customerListId") Long customerListId,
            @Param("employeeId") Long employeeId);

    /**
     * Get favorites list in list id of employee id
     * 
     * @param customerListIds 
     * @param employeeId
     * @return list like favorites
     */
    List<CustomersListFavourites> findByCustomerListIdInAndEmployeeId(List<Long> customerListIds, Long employeeId);

    /**
     * Get favorites list in list id.
     * 
     * @param customerListIds
     * @return list like favorites
     */
    @Query("SELECT clf.employeeId FROM CustomersListFavourites clf WHERE clf.customerListId = :customerListId")
    List<Long> findEmployeeIdsWithCustomerListId(@Param("customerListId") Long customerListId);

    /**
     * Delete customers_list_favourites By customer list id
     * 
     * @param customerListId customer list id get from request
     */
    @Modifying(clearAutomatically = true)
    public void deleteByCustomerListId(Long customerListId);

    /**
     * Delete customers_list_favourites By employee Id
     * 
     * @param customerListId list id
     * @param employeeId employee Id is favorites list
     */
    @Modifying(clearAutomatically = true)
    public void deleteByCustomerListIdAndEmployeeIdIn(Long customerListId, List<Long> employeeIds);
}
