package jp.co.softbrain.esales.customers.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.Tasks;
import jp.co.softbrain.esales.customers.service.dto.NextActionsDTO;

/**
 * Spring Data repository for the Tasks entity.
 */
@Repository
@XRayEnabled
public interface TasksRepository extends JpaRepository<Tasks, Long> {

    /**
     * find task Name, id by customer ids
     * 
     * @param customerIds - list Id customer
     * @return list next action
     */
    @Query("SELECT new jp.co.softbrain.esales.customers.service.dto.NextActionsDTO("
            + "t.taskId, t.taskName, t.customerId ) "
            + "FROM Tasks t "
            + "WHERE t.customerId IN (:customerIds)")
    List<NextActionsDTO> findIdAndNameByCustomerIds(@Param("customerIds") List<Long> customerIds);
    
    /**
     * Find customer id by task_id
     * 
     * @param taskIds - list task_id
     * @return - list cutomer id
     */
    @Query(value = "SELECT customer_id FROM tasks_view "
            + "WHERE task_id IN (:taskIds)", nativeQuery = true)
    public List<Long> findCustomerIdByTaskId(@Param("taskIds") List<Long> taskIds);
    
    /**
     * Find customer id by task_id
     * 
     * @param taskIds - list task_id
     * @return - list cutomer id
     */
    @Query(value = "SELECT customer_id FROM tasks_view tv "
            + "INNER JOIN calendars_view cal "
            + "   ON tv.calendar_id = cal.calendar_id "
            + "WHERE tv.task_id IN (:taskIds) "
            + "AND cal.start_date IS NOT NULL "
            + "AND cal.start_date > now() "
            + "AND tv.customer_id IS NOT NULL ", nativeQuery = true)
    public List<Long> findCustomerIdByNextTaskId(@Param("taskIds") List<Long> taskIds);

}
