package jp.co.softbrain.esales.employees.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.service.dto.commons.CustomFieldsInfoOutDTO;

/**
 * TMS Repository for Employees
 * 
 * @author phamminhphu
 */
@Repository
@XRayEnabled
public interface EmployeesRepositoryTms extends TmsRepository {

    /**
     * String that contains employees by Ids
     * 
     * @param employeeIds
     * @param transID
     * @return json data
     */
    String findAllWithEmployeeIds(List<Long> employeeIds, String transID);

    /**
     * String that contains staff info by managerId
     * 
     * @param employeeId
     * @param transID
     * @return json data
     */
    String findStaffWithManagerId(Long employeeId, String transID);

    /**
     * @param transID
     * @param newRecordIds
     * @param asList
     * @return
     */
    String getEmployeeIdsCreatedRelation(String transID, List<Long> newRecordIds, List<CustomFieldsInfoOutDTO> asList);

    /**
     * @param transID
     * @param employeeId
     * @return
     */
    String findOneEmployeeDTO(String transID, Long employeeId);
}
