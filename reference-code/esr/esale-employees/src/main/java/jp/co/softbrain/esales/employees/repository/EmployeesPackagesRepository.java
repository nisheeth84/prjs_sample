package jp.co.softbrain.esales.employees.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.employees.domain.EmployeesPackages;
import jp.co.softbrain.esales.employees.service.dto.CountUsedLicensesSubType1DTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackageSumIdsDTO;

/**
 * Spring Data  repository for the EmployeesPackages entity.
 */
@Repository
@XRayEnabled
public interface EmployeesPackagesRepository extends JpaRepository<EmployeesPackages, Long> {

    /**
     * @return list entity
     */
    List<EmployeesPackages> findAllByOrderByPackageIdAsc();

    /**
     * @return list entity
     */
    List<EmployeesPackages> findByEmployeeId(Long employeeId);

    /**
     * Get sum EmployeesPackage
     *
     * @return the DTO response
     */
    @Query("SELECT new jp.co.softbrain.esales.employees.service.dto.EmployeesPackageSumIdsDTO "
                 + "       (ep.packageId , COUNT(ep.packageId) AS countPackageId) "
                 + "FROM EmployeesPackages ep "
                 + "GROUP BY ep.packageId ")
    List<EmployeesPackageSumIdsDTO> getSumEmployeePackage();

    /**
     * Get sum EmployeesPackage by list id
     *
     * @param packageIds list package_id
     * @return the DTO response
     */
    @Query("SELECT new jp.co.softbrain.esales.employees.service.dto.EmployeesPackageSumIdsDTO "
                 + "       (ep.packageId , COUNT(ep.packageId) AS countPackageId) "
                 + "FROM EmployeesPackages ep "
                 + "WHERE ep.packageId IN (:packageIds) "
                 + "GROUP BY ep.packageId ")
    List<EmployeesPackageSumIdsDTO> getSumEmployeePackageByIds(@Param("packageIds") List<Long> packageIds);

    /**
     * Delete All employeesPackages by employeeId
     *
     * @param employeeId value of employee_id
     */
    @Modifying(clearAutomatically = true)
    void deleteByEmployeeId(Long employeeId);

    /**
     * count the number of employees
     *
     * @return total used package of each package ID
     */
    @Query(value = " SELECT new jp.co.softbrain.esales.employees.service.dto.CountUsedLicensesSubType1DTO(empPackages.packageId, COUNT(empPackages.packageId) )"
                 + " FROM EmployeesPackages empPackages"
                 + " GROUP BY empPackages.packageId ")
    List<CountUsedLicensesSubType1DTO> countUsedLicenses();

    /**
     * delete EmployeesPackages where PackageId Not In packageIds
     *
     */
    void deleteByPackageIdNotIn(List<Long> packageIds);

    /**
     * Find one EmployeesPackages by employee_package_id
     *
     * @param employeePackageId id of EmployeesPackages
     * @return the entity response
     */
    EmployeesPackages findByEmployeePackageId(Long employeePackageId);

    /**
     * select distinct employeeId
     *
     * @return list employeeId
     */
    @Query(value = " SELECT DISTINCT employees_packages.employee_id from employees_packages ", nativeQuery = true)
    List<Long> selectDistinctEmployeeId();
}
