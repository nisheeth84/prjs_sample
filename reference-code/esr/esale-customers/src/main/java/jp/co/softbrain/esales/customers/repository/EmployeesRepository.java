package jp.co.softbrain.esales.customers.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.Employees;
import jp.co.softbrain.esales.customers.service.dto.employees.EmployeeNameDTO;

/**
 * Spring Data repository for the Employees entity.
 */
@Repository
@XRayEnabled
public interface EmployeesRepository extends JpaRepository<Employees, Long> {

    @Query(value = "SELECT new jp.co.softbrain.esales.customers.service.dto.employees.EmployeeNameDTO("
            + "emp.employeeId, CONCAT(COALESCE(emp.employeeSurname, ''), ' ', COALESCE(emp.employeeName, '')) "
            + "AS employeeName ) "
            + "FROM Employees emp "
            + "WHERE emp.employeeStatus = 0 AND emp.employeeId IN (:employeeIds) ")
    public List<EmployeeNameDTO> getEmployeeNameByEmployeeIds(@Param("employeeIds") List<Long> employeeIds);

}
