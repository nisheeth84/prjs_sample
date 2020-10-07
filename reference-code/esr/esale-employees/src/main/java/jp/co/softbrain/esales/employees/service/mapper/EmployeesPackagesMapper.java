package jp.co.softbrain.esales.employees.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.employees.domain.EmployeesPackages;
import jp.co.softbrain.esales.employees.service.dto.EmployeesPackagesDTO;

/**
 * Mapper for the entity {@link EmployeesPackages} and its DTO
 * {@link EmployeesPackagesDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface EmployeesPackagesMapper extends EntityMapper<EmployeesPackagesDTO, EmployeesPackages> {

    default EmployeesPackages fromId(Long employeePackageId) {
        if (employeePackageId == null) {
            return null;
        }
        EmployeesPackages employeesPackages = new EmployeesPackages();
        employeesPackages.setEmployeePackageId(employeePackageId);
        return employeesPackages;
    }
}
