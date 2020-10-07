package jp.co.softbrain.esales.employees.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.service.dto.EmployeesHistoriesDTO;
import jp.co.softbrain.esales.employees.service.dto.GetEmployeeHistoryOutDTO;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.employees.domain.EmployeesHistories}.
 */
@XRayEnabled
public interface EmployeesHistoriesService {

    /**
     * Save a employeesHistories.
     *
     * @param employeesHistoriesDTO the entity to save.
     * @return the persisted entity.
     */
    EmployeesHistoriesDTO save(EmployeesHistoriesDTO employeesHistoriesDTO);

    /**
     * Get all the employeesHistories.
     *
     * @return the list of entities.
     */
    List<EmployeesHistoriesDTO> findAll();

    /**
     * Get the "id" employeesHistories.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EmployeesHistoriesDTO> findOne(Long id);

    /**
     * Delete the "id" employeesHistories.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Get employee's history changed information
     * 
     * @param employeeId - id to get
     * @param currentPage - current page
     * @param limit - max record on page
     * @return object contains informations
     */
    public GetEmployeeHistoryOutDTO getEmployeeHistory(Long employeeId, Integer currentPage, Integer limit);
}
