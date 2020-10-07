package jp.co.softbrain.esales.employees.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.domain.EmployeesGroupSearchConditions;

/**
 * Spring Data repository for the EmployeesGroupSearchConditions entity.
 */
@Repository
@XRayEnabled
public interface EmployeesGroupSearchConditionsRepository extends JpaRepository<EmployeesGroupSearchConditions, Long> {

    /**
     * Delete employees_group_search_condition by group_id
     * 
     * @param groupId - condition to delete
     */
    @Modifying(clearAutomatically = true)
    void deleteByGroupId(Long groupId);

    /**
     * Get conditional information search group by groupId
     * 
     * @param groupId the groupId of the entity
     * @return list of EmployeesGroupSearchConditions
     */
    List<EmployeesGroupSearchConditions> findByGroupId(Long groupId);

    /**
     * Find one EmployeesGroupSearchConditions by searchContentId
     * 
     * @param searchContentId id column in table
     * @return the entity response
     */
    EmployeesGroupSearchConditions findBySearchContentId(Long searchContentId);
}
