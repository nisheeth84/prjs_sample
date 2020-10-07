package jp.co.softbrain.esales.employees.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.domain.EmployeesHistories;

/**
 * Spring Data repository for the EmployeesHistories entity.
 */
@Repository
@XRayEnabled
public interface EmployeesHistoriesRepository extends JpaRepository<EmployeesHistories, Long> {

    /**
     * Get changed History by employeeId
     * 
     * @param employeeId - condition to find
     * @param limit - limit
     * @param offset - offset
     * @return list entity
     */
    @Query(value = "SELECT * "
                 + "FROM employees_histories eh "
                 + "WHERE eh.employee_id =:employeeId "
                 + "ORDER BY eh.created_date DESC "
                 + "LIMIT :limit OFFSET :offset ", nativeQuery = true)
    List<EmployeesHistories> getChangedHistories(@Param("employeeId") Long employeeId, @Param("limit") Integer limit,
            @Param("offset") Integer offset);

    /**
     * Find one EmployeesHistories by employee_history_id
     * 
     * @param employeeHistoryId id employeeHistory
     * @return the entiry response
     */
    EmployeesHistories findByEmployeeHistoryId(Long employeeHistoryId);

}
