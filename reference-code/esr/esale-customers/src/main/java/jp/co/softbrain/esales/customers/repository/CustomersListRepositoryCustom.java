package jp.co.softbrain.esales.customers.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.service.dto.CustomersListOptionalsDTO;
import jp.co.softbrain.esales.customers.service.dto.GetFavoriteCustomersListInfoDTO;
import jp.co.softbrain.esales.customers.service.dto.GetFavoriteCustomersSubType4DTO;
import jp.co.softbrain.esales.customers.service.dto.GetMyListDTO;

/**
 * CustomersListCustomerRepository
 *
 * @author lequyphuc
 */
@XRayEnabled
@Repository
public interface CustomersListRepositoryCustom {

    /**
     * Get information of employee's lists
     * 
     * @param employeeId - owner of lists
     * @param groupOfEmployee
     * @param depOfEmployee
     * @param mode mode of list
     * @return list DTO contains informations
     */
    public List<CustomersListOptionalsDTO> getMyList(Long employeeId, List<Long> depOfEmployee,
            List<Long> groupOfEmployee, Integer mode);

    /**
     * get my list
     * 
     * @pram customerListId
     * @param employeeId
     * @return GetMyListDTO
     */
    public GetMyListDTO getMyList(Long customerListId, Long employeeId);

    /**
     * Get information of shared list
     * 
     * @param employeeId - id has shared its lists
     * @param groupOfEmployee
     * @param depOfEmployee
     * @param mode - conditions id is owner of lists
     * @return - list DTO contains informations
     */
    public List<CustomersListOptionalsDTO> getSharedList(Long employeeId, List<Long> depOfEmployee,
            List<Long> groupOfEmployee, Integer mode);

    /**
     * Get the list of favorite customers
     * 
     * @param customerListFavouriteId Favorite group list
     * @return the list of favorite customers
     */
    public List<GetFavoriteCustomersListInfoDTO> getFavoriteCustomers(List<Long> customerListFavouriteId);

    /**
     * Get the list of favorite customers by employeeId
     * 
     * @param employeeId - employeeId
     * @return the list of favorite customers
     */
    public List<GetFavoriteCustomersSubType4DTO> getFavoriteCustomersByEmployeeId(Long employeeId);

    /**
     * Get favourite list of employee
     * 
     * @param employeeId - id of employees
     * @param groupIds
     * @param departmentIds
     * @return - employees
     */
    public List<CustomersListOptionalsDTO> getCustomerListFavoriteByEmployeeId(Long employeeId,
            List<Long> departmentIds, List<Long> groupIds);

    /**
     * Get all list owner of employee with search condition
     * 
     * @param userId - userId
     * @param departmentIds - department of userId
     * @param groupIds - group of user
     * @param searchValueEscapeSql - search value with escaped wild card
     * @return list DTO
     */
    public List<CustomersListOptionalsDTO> getAllListOwnerWithSearchCondition(Long userId, List<Long> departmentIds,
            List<Long> groupIds, String searchValueEscapeSql);

}
