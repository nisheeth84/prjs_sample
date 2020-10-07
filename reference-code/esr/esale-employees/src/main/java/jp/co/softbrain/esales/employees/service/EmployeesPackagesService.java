package jp.co.softbrain.esales.employees.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.service.dto.CountUsedLicensesOutDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackageSumIdsDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackagesDTO;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetServicesByPackageIdsResponse;
import jp.co.softbrain.esales.employees.web.rest.vm.response.RevokeEmployeeAccessResponse;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.employees.domain.EmployeesPackages}.
 */
@XRayEnabled
public interface EmployeesPackagesService {

    /**
     * Save a employeesPackages.
     *
     * @param employeesPackagesDTO the entity to save.
     * @return the persisted entity.
     */
    EmployeesPackagesDTO save(EmployeesPackagesDTO employeesPackagesDTO);

    /**
     * Get all the employeesPackages.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<EmployeesPackagesDTO> findAll(Pageable pageable);

    /**
     * Get all the employeesPackages.
     *
     * @return the list of entities.
     */
    List<EmployeesPackagesDTO> findAll();

    /**
     * Get the "id" employeesPackages.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EmployeesPackagesDTO> findOne(Long id);

    /**
     * Delete the "id" employeesPackages.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Get sum EmployeesPackage by list id
     * 
     * @param packageIds list packageId
     */
    List<EmployeesPackageSumIdsDTO> getSumEmployeePackageByIds(List<Long> packageIds);

    /**
     * Delete all employeesPackages by employeeId
     * 
     * @param employeeId employee id
     */
    void deleteByEmployeeId(Long employeeId);

    /**
     * count Used Licenses
     * 
     * @return total used package of each package ID
     */
    public CountUsedLicensesOutDTO countUsedLicenses();

    /**
     * Revoke employee account access to subscriptions that are no longer in use.
     * 
     * @param packageIds list package id not remove.
     * @return result remove.
     */
    public RevokeEmployeeAccessResponse revokeEmployeeAccess(List<Long> packageIds);

    /**
     * Get sum EmployeesPackage
     * 
     * @return packageIds list packageId
     */
    public List<EmployeesPackageSumIdsDTO> getSumEmployeePackage();
    
    /**
     * get service of user
     * @param employeeId
     * @param token
     * @param tenantId
     * @return
     */
    public GetServicesByPackageIdsResponse getServices(Long employeeId, String token, String tenantId);
}
