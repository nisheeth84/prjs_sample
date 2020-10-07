package jp.co.softbrain.esales.employees.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.domain.EmployeesGroupMembers;

/**
 * Spring Data repository for the EmployeesGroupMembers entity.
 */
@Repository
@XRayEnabled
public interface EmployeesGroupMembersRepository extends JpaRepository<EmployeesGroupMembers, Long> {

    /**
     * Delete employee group member by groupId.
     * 
     * @param groupId - condition to delete.
     */
    @Modifying(clearAutomatically = true)
    void deleteByGroupId(Long groupId);

    /**
     * Delete employees group member by groupId and employeeIds.
     * 
     * @param groupId group id remove employees.
     * @param employeeIdList employees id remove group.
     */
    @Modifying(clearAutomatically = true)
    void deleteByGroupIdAndEmployeeIdIn(Long groupId, List<Long> employeeIdList);

    /**
     * Delete the employee list from the add group
     * 
     * @param souceGroupId the groupId of the entity.
     * @param employeeIds the employeeId list of the entity.
     */
    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE "
                 + "FROM employees_group_members egm "
                 + "WHERE egm.group_id = :souceGroupId "
                 + "  AND egm.employee_id IN ( :employeeIds )", nativeQuery = true)
    void deleteByGroupIdAndEmployeeId(@Param("souceGroupId") Long souceGroupId,
            @Param("employeeIds") List<Long> employeeIds);

    /**
     * delete the employee list from the add group in case it exists by groupIds
     * and employeeIds
     * 
     * @param groupIds the list of groupId
     * @param employeeIds the list of employeeId
     */
    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE "
                 + "FROM employees_group_members egm "
                 + "WHERE egm.group_id IN ( :groupIds ) "
                 + "  AND egm.employee_id IN ( :employeeIds )", nativeQuery = true)
    void deleteByGroupIdsAndEmployeeIds(@Param("groupIds") List<Long> groupIds,
            @Param("employeeIds") List<Long> employeeIds);

    /**
     * select employeeId by list groupIds
     * 
     * @param employeeIds - condition to select
     */
    @Query("SELECT eg.employeeId FROM EmployeesGroupMembers eg WHERE eg.groupId IN :groupIds")
    List<Long> findEmployeeIdsWithGroupIds(@Param("groupIds") List<Long> groupIds);

    /**
     * Fild one EmployeesGroupMembers by group member id
     * 
     * @param groupMemberId td groupMemberId
     * @return the entity response
     */
    EmployeesGroupMembers findByGroupMemberId(Long groupMemberId);

    /**
     * select groupid by employeeid
     * 
     * @param listDeleted
     * @return list group id
     */
    @Query(value = "SELECT DISTINCT (eg.group_id) FROM employees_group_members eg WHERE eg.employee_id IN :employeeIds", nativeQuery = true)
    List<Long> findGroupIdsWithEmployeeIds(@Param("employeeIds") List<Long> employeeIds);
}
