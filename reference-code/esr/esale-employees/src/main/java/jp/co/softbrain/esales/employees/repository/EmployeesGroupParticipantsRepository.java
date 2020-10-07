package jp.co.softbrain.esales.employees.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.domain.EmployeesGroupParticipants;

/**
 * Spring Data repository for the EmployeesGroupParticipants entity.
 */
@Repository
@XRayEnabled
public interface EmployeesGroupParticipantsRepository extends JpaRepository<EmployeesGroupParticipants, Long> {

    /**
     * Delete employees_group_participants by group_id
     * 
     * @param groupId - condition to delete
     */
    @Modifying(clearAutomatically = true)
    public void deleteByGroupId(Long groupId);

    /**
     * get info participants group by groupId
     * 
     * @param groupId the groupId of the entity
     * @return the list of EmployeesGroupParticipants
     */
    List<EmployeesGroupParticipants> findByGroupId(Long groupId);

    /**
     * Delete record employees group participants by departmentId.
     * 
     * @param departmentId departmentId delete.
     */
    @Modifying(clearAutomatically = true)
    void deleteByDepartmentId(Long departmentId);

    /**
     * Find one EmployeesGroupParticipants by employeeGroupParticipantId
     * 
     * @param employeeGroupParticipantId
     * @return the response entity
     */
    EmployeesGroupParticipants findByEmployeeGroupParticipantId(Long employeeGroupParticipantId);
}
