package jp.co.softbrain.esales.customers.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.Customers;
import jp.co.softbrain.esales.customers.service.dto.CustomerIndexElasticSearchDTO;
import jp.co.softbrain.esales.customers.service.dto.CustomerNameDTO;
import jp.co.softbrain.esales.customers.service.dto.GetCustomersOutCustomerRelations;
import jp.co.softbrain.esales.customers.service.dto.GetDataSyncElasticSearchSubType1DTO;

/**
 * Spring Data repository for the Customers entity
 *
 * @author nguyenductruong
 */
@Repository
@XRayEnabled
public interface CustomersRepository extends JpaRepository<Customers, Long> {
    /**
     * Get all customers with given parentId
     *
     * @param customerId - condition
     * @return list entity
     */
    List<Customers> findByParentId(Long customerId);

    /**
     * Get count the number of customers by employees are in chagre
     *
     * @param employeeId the employeeId of the entity
     * @return count the number of customers by employees are in chagre
     */
    @Query(value = "SELECT COUNT(*) "
                 + "FROM customers "
                 + "WHERE employee_id = :employeeId", nativeQuery = true)
    Long countCustomers(@Param("employeeId") Long employeeId);

    /**
     * find customers by customer name order by creadted date
     *
     * @pram customerName - customerName
     * @return List<Customers>
     */
    public List<Customers> findAllByCustomerNameOrderByCreatedDateDesc(String customerName);

    /**
     * Delete customers by given id list
     *
     * @param customerIds - id list
     */
    @Modifying(clearAutomatically = true)
    void deleteByCustomerIdIn(List<Long> customerIds);

    /**
     * get id childCustomer
     *
     * @param customerIds - list customer id
     * @return list long
     */
    @Query(value = "SELECT customer_id "
                + "FROM customers "
                + "WHERE parent_id IN (:customerIds) ", nativeQuery = true)
    List<Long> findCustomerIdByParentIdIn(@Param("customerIds") List<Long> customerIds);

    /**
     * find By scenarioId In Customers
     *
     * @param scenariosId
     * @return List<Long> scenariosId: list scenarioId
     */
    List<Customers> findByscenarioIdIn(List<Long> scenariosId);

    /**
     * find By scenarioId In Customers
     *
     * @param scenariosId
     * @return Long scenariosId: list scenarioId
     */
    Customers findOneByScenarioId(Long scenariosId);

    /**
     * find customer by customerid
     * 
     * @param id
     *            customerid
     * @return optional customer
     */
    Optional<Customers> findByCustomerId(Long id);

    /**
     * Delete by customer id
     * 
     * @param customerId
     */
    @Modifying(clearAutomatically = true)
    void deleteByCustomerId(Long customerId);

    /**
     * Select customer parent with child ids
     * @param childIds list id child
     * @return - list customers parent
     */
    @Query("SELECT new jp.co.softbrain.esales.customers.service.dto.GetCustomersOutCustomerRelations( "
            + "cus.customerId, cus.customerName, cus.businessMainId, mb.customerBusinessName AS customerBusinessMainName, "
            + "cus.businessSubId, sb.customerBusinessName AS customerBusinessSubName,  parent.customerId AS parentId) "
            + "FROM Customers cus "
            + "LEFT JOIN CustomersBusiness mb "
            + "    ON cus.businessMainId = mb.customerBusinessId "
            + "LEFT JOIN CustomersBusiness sb "
            + "    ON cus.businessSubId = sb.customerBusinessId "
            + "INNER JOIN Customers child "
            + "    ON cus.customerId = child.parentId "
            + "INNER JOIN Customers parent "
            + "    ON cus.parentId = parent.customerId "
            + "WHERE child.customerId IN (:childIds)")
    List<GetCustomersOutCustomerRelations> findParentsByChilds(@Param("childIds") List<Long> childIds);

    /**
     * Select customer child with child ids
     * @param childIds list id child
     * @return - list customers parent
     */
    @Query("SELECT new jp.co.softbrain.esales.customers.service.dto.GetCustomersOutCustomerRelations( "
            + "cus.customerId, cus.customerName, cus.businessMainId, mb.customerBusinessName AS customerBusinessMainName, "
            + "cus.businessSubId, sb.customerBusinessName AS customerBusinessSubName, parent.customerId AS parentId) "
            + "FROM Customers cus "
            + "LEFT JOIN CustomersBusiness mb "
            + "    ON cus.businessMainId = mb.customerBusinessId "
            + "LEFT JOIN CustomersBusiness sb "
            + "    ON cus.businessSubId = sb.customerBusinessId "
            + "INNER JOIN Customers parent "
            + "    ON cus.parentId = parent.customerId "
            + "WHERE parent.customerId IN (:parentIds)")
    List<GetCustomersOutCustomerRelations> findChildsByParents(@Param("parentIds") List<Long> parentIds);

    /**
     * @param customerIds
     * @return
     */
    @Query("SELECT new jp.co.softbrain.esales.customers.service.dto.CustomerNameDTO("
            + "cus.customerId, cus.customerName) "
            + "FROM Customers cus "
            + "WHERE cus.customerId IN (:customerIds)")
    List<CustomerNameDTO> getCustomersNameByCustomerIds(@Param("customerIds") List<Long> customerIds);

    /**
     * Get information of customer
     * 
     * @param customerId
     *            customer id
     * @return customer information
     */
    @Query(" SELECT new jp.co.softbrain.esales.customers.service.dto.GetDataSyncElasticSearchSubType1DTO( "
            + "       cus.customerId" 
            + "     , cus.photoFileName " 
            + "     , cus.photoFilePath "
            + "     , cus.customerName" 
            + "     , cus.customerAliasName "
            + "     , p_customers.customerId as parentCustomerId "
            + "     , p_customers.customerName as parentCustomerName "
            + "     , cus.phoneNumber " + "     , cus.zipCode "
            + "     , cus.building "
            + "     , cus.address "
            + "     , cus.businessMainId " 
            + "     , cus.businessSubId " 
            + "     , cus.url " 
            + "     , cus.memo "
            + "     , cus.customerData " 
            + "     , cus.employeeId "
            + "     , cus.departmentId "
            + "     , cus.groupId "
            + "     , p_customers_business.customerBusinessId AS parentCustomerBusinessId "
            + "     , p_customers_business.customerBusinessName AS parentCustomerBusinessName "
            + "     , c_customers_business.customerBusinessId AS childCustomerBusinessId "
            + "     , c_customers_business.customerBusinessName AS childCustomerBusinessName "
            + "     , cus.createdDate "
            + "     , cus.createdUser " 
            + "     , cus.updatedDate " 
            + "     , cus.updatedUser ) "
            + " FROM Customers cus "

            + " LEFT JOIN Customers p_customers"
            + "        ON p_customers.customerId = cus.parentId "

            + " LEFT JOIN CustomersBusiness p_customers_business"
            + "        ON p_customers_business.customerBusinessId = cus.businessMainId "

            + " LEFT JOIN CustomersBusiness c_customers_business"
            + "        ON c_customers_business.customerBusinessId = cus.businessSubId "

            + " WHERE 1 = 1 "
            + "   AND cus.customerId IN (:customerIds) "
            + " ORDER BY cus.customerId ASC ")
    public List<GetDataSyncElasticSearchSubType1DTO> getCustomersInListId(@Param("customerIds") List<Long> customerIds);

    /**
     * Get all customer with list customer id
     * 
     * @param customerIds
     *            list customer ids
     * @return list entity
     */
    List<Customers> findAllByCustomerIdIn(List<Long> customerIds);

    /**
     * find customers by customer name
     *
     * @param customerName - customerName
     * @return List<Customers> list customer
     */
    public List<Customers> findAllByCustomerName(String customerName);

    /**
     * @param customerIds
     * @return
     */
    @Query(value = "SELECT new jp.co.softbrain.esales.customers.service.dto.CustomerIndexElasticSearchDTO("
            + "c.customerId, c.customerName, c.customerAliasName, pCustomer.customerName AS customerParent, "
            + "c.phoneNumber, c.zipCode, c.address, c.building, '' AS customerAddress, c.url, c.memo, c.customerData) "
            + "FROM Customers c "
            + "LEFT JOIN Customers pCustomer "
            + "       ON c.parentId = pCustomer.customerId "
            + "WHERE c.customerId IN (:customerIds)")
    List<CustomerIndexElasticSearchDTO> getDataForElasticSearch(@Param("customerIds") List<Long> customerIds);

    /**
     * Find entities by list parent
     * 
     * @param parentIds - list id parents
     * @return - list entity
     */
    List<Customers> findAllByParentIdIn(List<Long> parentIds);

    /**
     * count Customer with parentId
     * 
     * @param parentId
     *            parentId
     * @return number selected
     */
    @Query(value = " SELECT 1 "
                 + " FROM customers " 
                 + " WHERE customer_id = :parentId "
                 + "   AND :customerId IN (SELECT jsonb_array_elements(parent_tree)\\:\\:BIGINT) ", nativeQuery = true)
    Long countCustomerExistedWithParentId(@Param("parentId") Long parentId, @Param("customerId") Long customerId);
}
